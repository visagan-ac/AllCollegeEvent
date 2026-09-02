import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { generateAIResponse } from '@/lib/chatbotEngine';
import { MOCK_EVENTS } from '@/lib/mockData';

export async function GET() {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5);
  return NextResponse.json({
    geminiConfigured: hasEnvKey,
    defaultModel: hasEnvKey ? 'Google Gemini 1.5 Flash' : 'AllCollegeEvent Local AI Engine'
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, user, history, geminiApiKey: clientKey } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required.' },
        { status: 400 }
      );
    }

    const apiKey = (clientKey || req.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY || '').trim();

    // 1. Fetch relevant live events from PostgreSQL to supply as context
    let liveEvents: any[] = [];
    try {
      const qLower = query.toLowerCase();
      liveEvents = await prisma.event.findMany({
        take: 30,
        include: { organizer: true },
        orderBy: [
          { isFeatured: 'desc' },
          { trustScore: 'desc' }
        ]
      });
    } catch (dbErr) {
      console.warn('Chat API: using fallback event mock list', dbErr);
      liveEvents = MOCK_EVENTS;
    }

    const eventsContextString = liveEvents.map(e => 
      `- [ID: ${e.id || e.slug}] "${e.title}" | Category: ${e.category} | Mode: ${e.mode} | City: ${e.city || e.locationVenue || 'Online'} | Prize: ${e.prizePool || 'Certificates & Grants'} | Prerequisites: ${(e.requiredSkills || []).join(', ') || 'General Tech'} | Difficulty: ${e.difficultyLevel || e.difficulty || 'Intermediate'}`
    ).join('\n');

    // 2. If Gemini API Key exists, call Google Gemini via SDK
    if (apiKey && apiKey.length > 5) {
      const candidateModels = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash',
        'gemini-pro'
      ];

      const genAI = new GoogleGenerativeAI(apiKey);

      const systemInstruction = `You are the AllCollegeEvent.ai Intelligent Copilot & Technical Mentor for collegiate innovators.
You help college students discover relevant hackathons, workshops, and competitions, review project ideas, generate starter code, explain judging rubrics, and guide career trajectories.

Current Student Profile:
- Name: ${user?.name || 'Student Innovator'}
- College: ${user?.college || 'National Institute / Engineering Campus'}
- Department: ${user?.department || 'Computer Science & Engineering'}
- Year: Year ${user?.yearOfStudy || 3}
- Target Career Role: ${user?.careerGoals ? user.careerGoals[0] : 'AI/ML Engineer'}
- Verified Skills: ${user?.skills && user.skills.length > 0 ? user.skills.map((s: any) => s.name).join(', ') : 'Python, Full Stack, Problem Solving'}

Available Events in Database:
${eventsContextString}

Instructions:
1. Provide structured, encouraging, high-impact markdown answers with bullet points and bold highlights.
2. When answering technical or implementation questions, write clean, complete, syntax-highlighted code blocks (e.g. \`\`\`python, \`\`\`typescript, \`\`\`solidity).
3. If recommending events, mention their exact titles and why they fit the student's profile.
4. At the very end of your response, on a new line, include a JSON metadata block strictly formatted as:
<!--METADATA:{"suggestedEventIds":["id-of-relevant-event-1"],"quickReplies":["Follow-up suggestion 1","Follow-up suggestion 2"]}-->
`;

      let conversationContext = '';
      if (history && Array.isArray(history) && history.length > 0) {
        conversationContext = history
          .map((h: any) => `${h.sender === 'user' ? 'Student' : 'AI Copilot'}: ${h.text}`)
          .join('\n\n');
      }

      for (const modelName of candidateModels) {
        try {
          const startTime = performance.now();
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: systemInstruction
          });

          const prompt = conversationContext 
            ? `${conversationContext}\n\nStudent: ${query}`
            : query;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const rawText = response.text();

          if (rawText && typeof rawText === 'string') {
            const executionTimeMs = Math.round(performance.now() - startTime);

            // Parse metadata
            let cleanText = rawText;
            let suggestedEventIds: string[] = [];
            let quickReplies: string[] = ['Tell me more', 'Show cash prizes', 'Show code template'];

            const metaMatch = rawText.match(/<!--METADATA:([\s\S]*?)-->/);
            if (metaMatch && metaMatch[1]) {
              try {
                const parsedMeta = JSON.parse(metaMatch[1]);
                if (parsedMeta.suggestedEventIds) suggestedEventIds = parsedMeta.suggestedEventIds;
                if (parsedMeta.quickReplies) quickReplies = parsedMeta.quickReplies;
                cleanText = rawText.replace(/<!--METADATA:[\s\S]*?-->/, '').trim();
              } catch (e) {}
            }

            // Fallback suggested event IDs if none parsed
            if (suggestedEventIds.length === 0 && liveEvents.length > 0) {
              suggestedEventIds = liveEvents.slice(0, 2).map(e => e.id || e.slug);
            }

            return NextResponse.json({
              success: true,
              sender: 'ai',
              text: cleanText,
              suggestedEventIds,
              quickReplies,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              meta: {
                model: `Google Gemini (${modelName})`,
                provider: 'Google AI Studio',
                executionTimeMs,
                databaseEventsAnalyzed: liveEvents.length,
              }
            });
          }
        } catch (modelErr) {
          console.warn(`Gemini model ${modelName} failed, trying fallback model...`, modelErr);
        }
      }
    }

    // 3. Fallback to Local Semantic Engine
    const startTime = Date.now();
    const localResult = generateAIResponse(query, user || null, liveEvents.length > 0 ? liveEvents : MOCK_EVENTS);
    const executionTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      sender: 'ai',
      text: localResult.text,
      suggestedEventIds: localResult.suggestedEventIds || (liveEvents.length > 0 ? [liveEvents[0].id] : []),
      quickReplies: localResult.quickReplies || ['Show top matches', 'How to win hackathons?', 'Give me project ideas'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meta: {
        model: 'AllCollegeEvent AI Engine (Local Fallback)',
        engine: 'Semantic Knowledge Graph',
        executionTimeMs,
        databaseEventsAnalyzed: liveEvents.length,
      }
    });

  } catch (error: any) {
    console.error('AI Chatbot Route Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI chat query' },
      { status: 500 }
    );
  }
}
