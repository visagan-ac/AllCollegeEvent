import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_EVENTS } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const mode = searchParams.get('mode');
  const query = searchParams.get('q');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam) : 2000;

  try {
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
        { city: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ];
    }

    const events = await prisma.event.findMany({
      where,
      take: limit,
      include: {
        organizer: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { trustScore: 'desc' },
        { startDate: 'asc' },
      ],
    });

    if (events && events.length > 0) {
      const formatted = events.map(e => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        type: e.type,
        category: e.category,
        mode: e.mode,
        location: e.locationVenue || `${e.city || 'National Campus'}, India`,
        city: e.city || 'Online',
        startDate: e.startDate.toISOString().split('T')[0],
        endDate: e.endDate.toISOString().split('T')[0],
        duration: e.duration || '36 Hours',
        registrationDeadline: e.registrationDeadline ? e.registrationDeadline.toISOString().split('T')[0] : e.startDate.toISOString().split('T')[0],
        deadline: e.registrationDeadline ? e.registrationDeadline.toISOString().split('T')[0] : e.startDate.toISOString().split('T')[0],
        description: e.description,
        shortSummary: e.shortSummary,
        prizePool: e.prizePool || 'Cash Prizes & Grants',
        perks: e.perks || ['Mentorship', 'Certificate', 'Networking'],
        eligibility: e.eligibilityCriteria || ['Open to all students'],
        difficulty: e.difficultyLevel || 'Intermediate',
        targetAudience: e.targetAudience || ['College Students'],
        careerRelevance: e.careerRelevance || ['Software Engineer'],
        trustScore: e.trustScore,
        trustFactors: (e.trustBreakdown as any) || {
          organizerReputation: 95,
          curriculumDepth: 95,
          prizeVerification: 95,
          mentorshipQuality: 95,
        },
        isFeatured: e.isFeatured,
        maxCapacity: e.maxCapacity || 1000,
        currentRegistrations: e.currentRegistrations || 120,
        requiredSkills: e.perks && e.perks.length > 0 ? ['Python', 'System Design', 'Git'] : ['Tech Innovation'],
        skillsGained: ['Production Architecture', 'Industry Mentorship', 'High-Scale Engineering'],
        organizer: {
          name: e.organizer?.organizationName || 'Premier College Chapters Alliance',
          college: e.organizer?.collegeAffiliation || 'National Institute / University',
          verified: Boolean(e.organizer?.isVerified ?? true),
          logoUrl: '🏆',
        },
        syllabus: (e.syllabus as any) || [],
        mentors: (e.mentors as any) || [],
      }));

      return NextResponse.json({
        success: true,
        source: 'Neon PostgreSQL Database',
        count: formatted.length,
        events: formatted,
      });
    }

    return NextResponse.json({
      success: true,
      source: 'Mock Seed (PostgreSQL Ready)',
      count: MOCK_EVENTS.length,
      events: MOCK_EVENTS,
    });
  } catch (error: any) {
    console.error('Error querying events in PostgreSQL:', error);
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
      city,
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
        locationVenue: locationVenue || 'Online / Campus Arena',
        city: city || 'Hyderabad',
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
