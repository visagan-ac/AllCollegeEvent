import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtDecode } from 'jwt-decode';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential, googleUser } = body;

    let email = '';
    let name = '';
    let avatar = '';

    if (credential) {
      // Decode official Google ID Token JWT
      const decoded: any = jwtDecode(credential);
      email = decoded.email;
      name = decoded.name || decoded.given_name || 'Google User';
      avatar = decoded.picture || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;
    } else if (googleUser) {
      email = googleUser.email;
      name = googleUser.name;
      avatar = googleUser.avatar;
    }

    if (!email) {
      return NextResponse.json({ error: 'Valid Google account email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists in Neon PostgreSQL
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        interactions: true,
      },
    });

    if (existingUser && existingUser.collegeName) {
      // Existing registered student profile
      const studentProfile = {
        id: existingUser.id,
        name: existingUser.fullName,
        email: existingUser.email,
        avatar: existingUser.avatarUrl || avatar,
        college: existingUser.collegeName,
        department: existingUser.department || 'Computer Science & Engineering',
        yearOfStudy: existingUser.yearOfStudy || 3,
        cgpa: existingUser.cgpa || 8.5,
        location: existingUser.locationCity ? `${existingUser.locationCity}, ${existingUser.locationState || 'India'}` : 'India',
        skills: existingUser.skills.map((s: any) => ({
          name: s.skill?.name || 'Skill',
          level: s.proficiencyLevel || 'Intermediate',
          score: s.proficiencyScore || 75,
        })),
        interests: existingUser.careerGoals || [],
        careerGoals: existingUser.careerGoals || ['Software Engineer'],
        targetCompanies: existingUser.targetCompanies || ['Google', 'Microsoft'],
        preferredMode: existingUser.preferredMode || 'All',
        previousEvents: [],
        bookmarkedEventIds: existingUser.interactions.filter((i: any) => i.interactionType === 'bookmark').map((i: any) => i.eventId),
        registeredEventIds: existingUser.interactions.filter((i: any) => i.interactionType === 'register').map((i: any) => i.eventId),
      };

      return NextResponse.json({
        success: true,
        isNewUser: false,
        user: studentProfile,
      });
    }

    // New Google Signup — prompt for profile onboarding
    return NextResponse.json({
      success: true,
      isNewUser: true,
      name,
      email: cleanEmail,
      avatar,
      message: 'Google authenticated. Please complete your profile.',
    });
  } catch (error: any) {
    console.error('Error in Google auth route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to authenticate Google user' },
      { status: 500 }
    );
  }
}
