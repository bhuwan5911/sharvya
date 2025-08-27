import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

// GET badges for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const badges = await prisma.badge.findMany({
      where: { userId: Number(userId) },
      orderBy: { earnedAt: 'desc' }
    });
    
    return NextResponse.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }
}

// POST to award a new badge
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, description, icon, color, type, metadata } = body;

    if (!userId || !name || !description || !icon || !color || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if badge already exists for this user
    const existingBadge = await prisma.badge.findFirst({
      where: {
        userId: Number(userId),
        name: name
      }
    });

    if (existingBadge) {
      return NextResponse.json({ error: 'Badge already earned' }, { status: 409 });
    }

    const badge = await prisma.badge.create({
      data: {
        userId: Number(userId),
        name,
        description,
        icon,
        color,
        type,
        metadata: metadata || null
      }
    });

    return NextResponse.json(badge);
  } catch (error) {
    console.error('Error creating badge:', error);
    return NextResponse.json({ error: 'Failed to create badge' }, { status: 500 });
  }
} 