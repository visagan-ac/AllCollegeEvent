import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/chatbotEngine';
import { MOCK_EVENTS } from '@/lib/mockData';

export async function GET() {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5);
  return NextResponse.json({
    geminiConfigured: hasEnvKey,
    defaultModel: hasEnvKey ? 'Google Gemini 1.5 Flash' : 'AllCollegeEvent Local AI v2.1'
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

    // IF A GEMINI API KEY IS PROVIDED, ATTEMPT TO CALL GEMINI REST API
    if (apiKey && apiKey.length > 5) {
      const candidateModels = [
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-pro'
      ];

      const systemPrompt = `You are the AllCollegeEvent.com AI Intelligence Copilot.
You assist collegiate students in discovering hackathons, conferences, competitions, and bootcamps, and providing technical guidance, code examples, team formation playbooks, and career advice.

Current Student Context:
- Name: ${user?.name || 'Student'}
- Department: ${user?.department || 'Computer Science & Engineering'}
- Year of Study: Year ${user?.yearOfStudy || 3}
- Target Career Role: ${user?.careerGoals ? user.careerGoals[0] : 'AI/ML Engineer'}
- Verified Skills: ${user?.skills ? user.skills.map((s: any) => s.name).join(', ') : 'Python, Machine Learning'}

Available Major Events in the Knowledge Graph:
${MOCK_EVENTS.map(e => `- [${e.id}] "${e.title}" | Category: ${e.category} | Mode: ${e.mode} (${e.location}) | Prize: ${e.prizePool || 'Certificates'} | Skills: ${e.requiredSkills.join(', ')} | Trust Score: ${e.trustScore}/100`).join('\n')}

Instructions:
1. Provide helpful, conversational, structured markdown answers with bullet points and bold highlights.
2. If the user asks for code, provide clean syntax-highlighted code blocks (Python, FastAPI, PyTorch, React, etc.).
3. Mention relevant events from the catalog when applicable.
4. At the very end of your response, on a new line, include a JSON metadata block strictly formatted as:
<!--METADATA:{"suggestedEventIds":["event-id-1"],"quickReplies":["Short follow-up 1","Short follow-up 2"]}-->
`;

      let promptWithHistory = query;
      if (history && Array.isArray(history) && history.length > 0) {
        const formattedHistory = history.map((h: any) => `${h.sender === 'user' ? 'Student' : 'AI Copilot'}: ${h.text}`).join('\n');
        promptWithHistory = `Previous Conversation:\n${formattedHistory}\n\nStudent: ${query}`;
      }

      for (const modelName of candidateModels) {
        try {
          const startTime = performance.now();
          const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

          const geminiRes = await fetch(endpointUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: `${systemPrompt}\n\nUser Question: ${promptWithHistory}` }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
              }
            })
          });

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (rawText && typeof rawText === 'string') {
              const executionTimeMs = Math.round(performance.now() - startTime);

              // Extract metadata block if present
              let cleanText = rawText;
              let suggestedEventIds: string[] = ['allcollege-grand-hackathon-2026'];
              let quickReplies: string[] = ['Tell me more', 'Show cash prizes', 'Offline events'];

              const metaMatch = rawText.match(/<!--METADATA:([\s\S]*?)-->/);
              if (metaMatch && metaMatch[1]) {
                try {
                  const parsedMeta = JSON.parse(metaMatch[1]);
                  if (parsedMeta.suggestedEventIds) suggestedEventIds = parsedMeta.suggestedEventIds;
                  if (parsedMeta.quickReplies) quickReplies = parsedMeta.quickReplies;
                  cleanText = rawText.replace(/<!--METADATA:[\s\S]*?-->/, '').trim();
                } catch (e) {}
              }

              suggestedEventIds = suggestedEventIds.filter(id => MOCK_EVENTS.some(e => e.id === id));
              if (suggestedEventIds.length === 0) {
                suggestedEventIds = ['allcollege-grand-hackathon-2026', 'ai-vision-summit-2026'];
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
                  rateLimit: 'Active (Gemini Live API)',
                }
              });
            }
          }
        } catch (e) {
          // Try next candidate model
        }
      }
    }

    // FALLBACK TO TRAINED LOCAL ENGINE (Clean, natural answer without error clutter)
    const startTime = Date.now();
    const localResult = generateAIResponse(query, user || null, MOCK_EVENTS);
    const executionTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      sender: 'ai',
      text: localResult.text,
      suggestedEventIds: localResult.suggestedEventIds || [],
      quickReplies: localResult.quickReplies || [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meta: {
        model: 'AllCollegeEvent-Local-AI-v2.1',
        engine: 'Local Semantic Knowledge Graph',
        executionTimeMs,
        rateLimit: 'Unlimited (Local Host)',
      }
    });
  } catch (error: any) {
    console.error('AI Chatbot API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing query.' },
      { status: 500 }
    );
  }
}
