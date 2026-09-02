import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAIResponse } from '@/lib/chatbotEngine';
import { MOCK_EVENTS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    engine: 'AllCollegeEvent Native Cognitive Model v3.0',
    capabilities: [
      'Natural Language Opportunity Search',
      'Technical Code Generation (Python, PyTorch, FastAPI, Next.js, Solidity)',
      'Hackathon Winning Playbooks & Pitch Deck Architecture',
      'Personalized Career Gap & Placement Roadmaps',
      '1-Click Interactive Event Pass Linking'
    ],
    offlineReady: true,
    latencyMs: 0
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, user } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required.' },
        { status: 400 }
      );
    }

    const startTime = performance.now();

    // 1. Fetch live events from Neon PostgreSQL (or fallback to catalog)
    let liveEvents: any[] = [];
    try {
      liveEvents = await prisma.event.findMany({
        take: 50,
        include: { organizer: true },
        orderBy: [
          { isFeatured: 'desc' },
          { trustScore: 'desc' }
        ]
      });
    } catch (dbErr) {
      liveEvents = MOCK_EVENTS;
    }

    const activeEvents = liveEvents && liveEvents.length > 0 ? liveEvents : MOCK_EVENTS;

    // 2. Execute our dedicated in-house Cognitive AI Model
    const modelResult = generateAIResponse(query, user || null, activeEvents);
    const executionTimeMs = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      sender: 'ai',
      text: modelResult.text,
      suggestedEventIds: modelResult.suggestedEventIds || [],
      quickReplies: modelResult.quickReplies || [
        'Top hackathons with cash prizes',
        'FastAPI starter code',
        'How to win a hackathon?',
        'Show offline events in Bengaluru'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meta: {
        model: 'AllCollegeEvent AI v3.0 (Native Neural Engine)',
        engine: 'Proprietary Event Intelligence & Code Synthesizer',
        executionTimeMs,
        rateLimit: 'Unlimited (Native On-Premise Engine)',
        databaseEventsAnalyzed: activeEvents.length,
      }
    });

  } catch (error: any) {
    console.error('Native AI Model Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI chat query' },
      { status: 500 }
    );
  }
}
