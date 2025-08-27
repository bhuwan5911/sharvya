import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all profiles
export async function GET() {
  const profiles = await prisma.profile.findMany({ include: { user: true } });
  return NextResponse.json(profiles);
}

// POST create a new profile
export async function POST(request: Request) {
  const data = await request.json();
  const profile = await prisma.profile.create({
    data: {
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      userId: data.userId
    }
  });
  return NextResponse.json(profile);
} 