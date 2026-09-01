import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
};

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  provider?: string;
  stats?: {
    eventsCount: number;
    usersCount: number;
    skillsCount: number;
  };
}> {
  if (!process.env.DATABASE_URL) {
    return {
      connected: false,
      message: 'DATABASE_URL environment variable is missing on Vercel settings',
      provider: 'Missing DATABASE_URL',
    };
  }

  try {
    const [eventsCount, usersCount, skillsCount] = await Promise.all([
      prisma.event.count(),
      prisma.user.count(),
      prisma.skill.count(),
    ]);

    return {
      connected: true,
      message: 'PostgreSQL Database Connected Successfully via Prisma ORM',
      provider: 'Neon PostgreSQL (Prisma ORM)',
      stats: {
        eventsCount,
        usersCount,
        skillsCount,
      },
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error?.message || 'Failed to query Neon PostgreSQL',
      provider: 'PostgreSQL Connection Error',
    };
  }
}
