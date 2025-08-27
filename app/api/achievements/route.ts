import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all achievements
export async function GET() {
  const achievements = await prisma.achievement.findMany({ include: { user: true } });
  return NextResponse.json(achievements);
}

// POST create a new achievement
export async function POST(request: Request) {
  const data = await request.json();
  const achievement = await prisma.achievement.create({
    data: {
      title: data.title,
      userId: data.userId
    }
  });
  return NextResponse.json(achievement);
} 