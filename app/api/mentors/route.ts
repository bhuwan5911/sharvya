import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all mentors
export async function GET() {
  try {
    const mentors = await prisma.user.findMany({
      where: {
        profile: {
          expertise: { not: null }
        }
      },
      include: { profile: true }
    });
    return NextResponse.json(mentors);
  } catch (error) {
    console.error('GET /api/mentors error:', error);
    return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 });
  }
}

// POST register as mentor
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Update user profile to become a mentor
    const updatedProfile = await prisma.profile.update({
      where: { userId: data.userId },
      data: {
        expertise: data.expertise,
        experience: data.experience,
        bio: data.bio,
        availability: data.availability,
        languages: JSON.stringify(data.languages || ['en']),
        interests: JSON.stringify(data.interests || [])
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully registered as mentor',
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('POST /api/mentors error:', error);
    return NextResponse.json({ error: 'Failed to register as mentor' }, { status: 500 });
  }
} 