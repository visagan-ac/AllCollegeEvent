import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, eventId, eventSlug, interactionType } = body;

    if (!userEmail || (!eventId && !eventSlug) || !interactionType) {
      return NextResponse.json(
        { error: 'Missing userEmail, eventId/eventSlug, or interactionType' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the event (by ID or slug)
    const event = await prisma.event.findFirst({
      where: {
        OR: [
          eventId ? { id: eventId } : {},
          eventSlug ? { slug: eventSlug } : {},
          eventId ? { slug: eventId } : {},
        ],
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if interaction already exists (e.g. for bookmark or register)
    const existing = await prisma.userEventInteraction.findFirst({
      where: {
        userId: user.id,
        eventId: event.id,
        interactionType,
      },
    });

    if (existing) {
      // If toggling bookmark off
      if (interactionType === 'bookmark') {
        await prisma.userEventInteraction.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({
          success: true,
          action: 'removed',
          message: 'Bookmark removed from PostgreSQL',
        });
      }

      return NextResponse.json({
        success: true,
        action: 'already_exists',
        interaction: existing,
      });
    }

    // Create interaction log in PostgreSQL
    const newInteraction = await prisma.userEventInteraction.create({
      data: {
        userId: user.id,
        eventId: event.id,
        interactionType,
      },
    });

    // If registration, increment event registration count
    if (interactionType === 'register') {
      await prisma.event.update({
        where: { id: event.id },
        data: {
          currentRegistrations: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      action: 'created',
      interaction: newInteraction,
    });
  } catch (error: any) {
    console.error('Error logging interaction to PostgreSQL:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to log interaction to database' },
      { status: 500 }
    );
  }
}
