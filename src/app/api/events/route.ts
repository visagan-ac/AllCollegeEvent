import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_EVENTS } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const mode = searchParams.get('mode');
  const query = searchParams.get('q');

  try {
    // Attempt to query live PostgreSQL database via Prisma
    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (mode && mode !== 'All') {
      where.mode = mode;
    }
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    if (events && events.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'PostgreSQL Database',
        count: events.length,
        events,
      });
    }

    // If database is empty or not yet seeded, return fallback mock events
    return NextResponse.json({
      success: true,
      source: 'Mock Seed (PostgreSQL Ready)',
      count: MOCK_EVENTS.length,
      events: MOCK_EVENTS,
    });
  } catch (error) {
    // Graceful fallback to mock data if database connection string is not yet set up
    return NextResponse.json({
      success: true,
      source: 'In-Memory Fallback',
      count: MOCK_EVENTS.length,
      events: MOCK_EVENTS,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      type,
      category,
      mode,
      locationVenue,
      startDate,
      endDate,
      description,
      shortSummary,
      prizePool,
      perks,
      difficultyLevel,
      organizerName,
    } = body;

    if (!title || !category || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, startDate, endDate' },
        { status: 400 }
      );
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const newEvent = await prisma.event.create({
      data: {
        title,
        slug,
        type: type || 'Hackathon',
        category,
        mode: mode || 'Hybrid',
        locationVenue: locationVenue || 'Online / Campus',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationDeadline: new Date(startDate),
        description: description || title,
        shortSummary: shortSummary || title,
        prizePool: prizePool || 'Certificate & Badges',
        perks: perks || [],
        difficultyLevel: difficultyLevel || 'Intermediate',
        trustScore: 92.0,
      },
    });

    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create event in PostgreSQL' },
      { status: 500 }
    );
  }
}
