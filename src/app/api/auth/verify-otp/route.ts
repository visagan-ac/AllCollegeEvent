import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    // 1. Verify OTP in PostgreSQL (or master test code 123456)
    let isValid = false;

    if (cleanOtp === '123456') {
      isValid = true;
    } else {
      const record = await prisma.otpVerification.findFirst({
        where: {
          email: cleanEmail,
          otp: cleanOtp,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (record) {
        isValid = true;
        // Delete verified OTP
        await prisma.otpVerification.delete({
          where: { id: record.id },
        });
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // 2. Check if user already exists in PostgreSQL
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

    if (existingUser) {
      const studentProfile = {
        id: existingUser.id,
        name: existingUser.fullName,
        email: existingUser.email,
        avatar: existingUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${existingUser.fullName}`,
        college: existingUser.collegeName || '',
        department: existingUser.department || '',
        yearOfStudy: existingUser.yearOfStudy || 1,
        cgpa: existingUser.cgpa || 8.0,
        location: existingUser.locationCity ? `${existingUser.locationCity}, ${existingUser.locationState || 'India'}` : 'India',
        skills: existingUser.skills.map((s: any) => ({
          name: s.skill?.name || 'Skill',
          level: s.proficiencyLevel || 'Intermediate',
          score: s.proficiencyScore || 75,
        })),
        interests: existingUser.careerGoals || [],
        careerGoals: existingUser.careerGoals || [],
        targetCompanies: existingUser.targetCompanies || [],
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

    // If new user, return verified = true so onboarding modal opens
    return NextResponse.json({
      success: true,
      isNewUser: true,
      email: cleanEmail,
      message: 'Email verified. Please complete your profile onboarding.',
    });
  } catch (error: any) {
    console.error('Error in verify-otp route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
