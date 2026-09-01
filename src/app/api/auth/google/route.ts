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

    // 1. Upsert User in Neon PostgreSQL
    const savedUser = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        fullName: name,
        avatarUrl: avatar,
      },
      create: {
        email: cleanEmail,
        fullName: name,
        avatarUrl: avatar,
        collegeName: 'National Institute of Technology',
        department: 'Computer Science & Engineering (AI & ML)',
        yearOfStudy: 3,
        cgpa: 8.9,
        locationCity: 'Hyderabad',
        careerGoals: ['AI/ML Engineer', 'Full Stack AI Developer'],
        targetCompanies: ['Google', 'OpenAI', 'Microsoft'],
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        interactions: true,
      },
    });

    // 2. If new user without skills, add standard starter skills
    if (savedUser.skills.length === 0) {
      const defaultSkills = [
        { name: 'Python', category: 'Programming', level: 'Expert', score: 92 },
        { name: 'Machine Learning', category: 'AI', level: 'Intermediate', score: 85 },
        { name: 'PyTorch', category: 'AI Frameworks', level: 'Intermediate', score: 75 },
        { name: 'React / Next.js', category: 'Frontend', level: 'Intermediate', score: 70 },
        { name: 'Git', category: 'DevOps', level: 'Expert', score: 90 },
      ];

      for (const s of defaultSkills) {
        const skill = await prisma.skill.upsert({
          where: { name: s.name },
          update: {},
          create: { name: s.name, category: s.category, demandIndex: 1.2 },
        });

        await prisma.userSkill.upsert({
          where: {
            userId_skillId: {
              userId: savedUser.id,
              skillId: skill.id,
            },
          },
          update: {},
          create: {
            userId: savedUser.id,
            skillId: skill.id,
            proficiencyLevel: s.level,
            proficiencyScore: s.score,
          },
        });
      }
    }

    // 3. Format StudentProfile object
    const studentProfile = {
      id: savedUser.id,
      name: savedUser.fullName,
      email: savedUser.email,
      avatar: savedUser.avatarUrl || avatar,
      college: savedUser.collegeName || 'National Institute of Technology',
      department: savedUser.department || 'Computer Science & Engineering',
      yearOfStudy: savedUser.yearOfStudy || 3,
      cgpa: savedUser.cgpa || 8.9,
      location: savedUser.locationCity || 'Hyderabad, India',
      skills: [
        { name: 'Python', level: 'Expert' as const, score: 92 },
        { name: 'Machine Learning', level: 'Intermediate' as const, score: 85 },
        { name: 'PyTorch', level: 'Intermediate' as const, score: 75 },
        { name: 'React / Next.js', level: 'Intermediate' as const, score: 70 },
        { name: 'Git', level: 'Expert' as const, score: 90 },
      ],
      interests: savedUser.careerGoals || ['Artificial Intelligence', 'Hackathons'],
      careerGoals: savedUser.careerGoals || ['AI/ML Engineer'],
      targetCompanies: savedUser.targetCompanies || ['Google', 'OpenAI', 'Microsoft'],
      preferredMode: savedUser.preferredMode || 'All',
      previousEvents: [],
      bookmarkedEventIds: savedUser.interactions.filter((i: any) => i.interactionType === 'bookmark').map((i: any) => i.eventId),
      registeredEventIds: savedUser.interactions.filter((i: any) => i.interactionType === 'register').map((i: any) => i.eventId),
    };

    return NextResponse.json({
      success: true,
      user: studentProfile,
    });
  } catch (error: any) {
    console.error('Error in Google auth route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to authenticate Google user' },
      { status: 500 }
    );
  }
}
