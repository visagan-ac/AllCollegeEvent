import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/prisma';

export async function GET() {
  try {
    const status = await checkDatabaseConnection();
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      ...status,
      tablesConfigured: [
        'users',
        'skills',
        'user_skills',
        'organizers',
        'events',
        'event_skills',
        'user_event_interactions',
        'ai_recommendations'
      ],
      envConfigured: Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('USER:PASSWORD')),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        message: error?.message || 'Error querying database status',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
