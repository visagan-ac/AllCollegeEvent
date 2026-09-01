import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_STUDENTS } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || 'visagan@college.edu';

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        recommendations: {
          include: {
            event: true,
          },
        },
      },
    });

    if (user) {
      return NextResponse.json({
        success: true,
        source: 'PostgreSQL Database',
        user,
      });
    }

    // Default fallback student profile
    return NextResponse.json({
      success: true,
      source: 'Default Profile (PostgreSQL Ready)',
      user: MOCK_STUDENTS[0],
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      source: 'In-Memory Fallback',
      user: MOCK_STUDENTS[0],
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, cgpa, careerGoals, targetCompanies, preferredMode } = body;

    if (!email) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        cgpa: cgpa !== undefined ? parseFloat(cgpa) : undefined,
        careerGoals: careerGoals || undefined,
        targetCompanies: targetCompanies || undefined,
        preferredMode: preferredMode || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update user in PostgreSQL' },
      { status: 500 }
    );
  }
}
