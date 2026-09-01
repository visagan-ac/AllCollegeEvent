import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_STUDENTS } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({
      success: true,
      source: 'Default',
      user: null,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        interactions: true,
        recommendations: {
          include: {
            event: true,
          },
        },
      },
    });

    if (user) {
      // Map Prisma user to StudentProfile structure
      const formattedSkills = user.skills.map((s: any) => ({
        name: s.skill?.name || 'Skill',
        level: s.proficiencyLevel || 'Intermediate',
        score: s.proficiencyScore || 75,
      }));

      const bookmarkedEventIds = user.interactions
        .filter((i: any) => i.interactionType === 'bookmark')
        .map((i: any) => i.eventId);

      const registeredEventIds = user.interactions
        .filter((i: any) => i.interactionType === 'register')
        .map((i: any) => i.eventId);

      const studentProfile = {
        id: user.id,
        name: user.fullName,
        email: user.email,
        avatar: user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.fullName}`,
        college: user.collegeName || '',
        department: user.department || '',
        yearOfStudy: user.yearOfStudy || 1,
        cgpa: user.cgpa || 8.0,
        location: user.locationCity ? `${user.locationCity}, ${user.locationState || 'India'}` : 'India',
        skills: formattedSkills,
        interests: user.careerGoals || [],
        careerGoals: user.careerGoals || [],
        targetCompanies: user.targetCompanies || [],
        preferredMode: user.preferredMode || 'All',
        previousEvents: [],
        bookmarkedEventIds,
        registeredEventIds,
      };

      return NextResponse.json({
        success: true,
        source: 'PostgreSQL Database',
        user: studentProfile,
      });
    }

    return NextResponse.json({
      success: false,
      source: 'Not Found',
      user: null,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Database error',
      user: null,
    });
  }
}

// POST - Create or Upsert User in PostgreSQL
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      avatar,
      college,
      department,
      yearOfStudy,
      cgpa,
      location,
      careerGoals,
      targetCompanies,
      skills,
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    const fullName = name || 'Student Innovator';

    // Upsert the user profile in PostgreSQL
    const savedUser = await prisma.user.upsert({
      where: { email },
      update: {
        fullName,
        avatarUrl: avatar || undefined,
        collegeName: college || undefined,
        department: department || undefined,
        yearOfStudy: yearOfStudy ? parseInt(yearOfStudy.toString()) : undefined,
        cgpa: cgpa ? parseFloat(cgpa.toString()) : undefined,
        locationCity: location || undefined,
        careerGoals: careerGoals || undefined,
        targetCompanies: targetCompanies || undefined,
      },
      create: {
        email,
        fullName,
        avatarUrl: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${fullName}`,
        collegeName: college || 'Technical University',
        department: department || 'Computer Science & Engineering',
        yearOfStudy: yearOfStudy ? parseInt(yearOfStudy.toString()) : 1,
        cgpa: cgpa ? parseFloat(cgpa.toString()) : 8.5,
        locationCity: location || 'Hyderabad',
        careerGoals: careerGoals || ['AI/ML Engineer'],
        targetCompanies: targetCompanies || ['Top Tech Firms'],
      },
    });

    // Upsert skills if provided
    if (skills && Array.isArray(skills) && skills.length > 0) {
      for (const skillItem of skills) {
        if (!skillItem.name) continue;

        // Ensure skill taxonomy exists
        const skill = await prisma.skill.upsert({
          where: { name: skillItem.name },
          update: {},
          create: {
            name: skillItem.name,
            category: 'Technical',
            demandIndex: 1.2,
          },
        });

        // Link user to skill
        await prisma.userSkill.upsert({
          where: {
            userId_skillId: {
              userId: savedUser.id,
              skillId: skill.id,
            },
          },
          update: {
            proficiencyLevel: skillItem.level || 'Intermediate',
            proficiencyScore: skillItem.score || 75,
          },
          create: {
            userId: savedUser.id,
            skillId: skill.id,
            proficiencyLevel: skillItem.level || 'Intermediate',
            proficiencyScore: skillItem.score || 75,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User profile successfully saved to PostgreSQL',
      user: savedUser,
    });
  } catch (error: any) {
    console.error('Error saving user to PostgreSQL:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save user to database' },
      { status: 500 }
    );
  }
}

// PUT - Update existing user profile in PostgreSQL
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, college, department, yearOfStudy, cgpa, careerGoals, targetCompanies, preferredMode, skills } = body;

    if (!email) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        fullName: name || undefined,
        collegeName: college || undefined,
        department: department || undefined,
        yearOfStudy: yearOfStudy ? parseInt(yearOfStudy.toString()) : undefined,
        cgpa: cgpa !== undefined ? parseFloat(cgpa.toString()) : undefined,
        careerGoals: careerGoals || undefined,
        targetCompanies: targetCompanies || undefined,
        preferredMode: preferredMode || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User profile successfully updated in PostgreSQL',
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update user in PostgreSQL' },
      { status: 500 }
    );
  }
}
