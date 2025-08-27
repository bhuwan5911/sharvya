export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all users or filter by query params
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    if (searchParams.get('email')) where.email = searchParams.get('email');
    if (searchParams.get('name')) where.name = searchParams.get('name');
    if (searchParams.get('id')) where.id = Number(searchParams.get('id'));
    if (searchParams.get('role')) {
      // Filter by role (mentor/student) based on profile expertise
      if (searchParams.get('role') === 'mentor') {
        where.profile = {
          expertise: { not: null }
        };
      } else if (searchParams.get('role') === 'student') {
        where.profile = {
          expertise: null
        };
      }
    }
    const users = await prisma.user.findMany({
      where,
      include: { profile: true, quizzes: true, achievements: true, voiceRecords: true }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST create a new user
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true }
    });

    if (existingUser) {
      // Update existing user and profile
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: data.name,
        }
      });

      if (existingUser.profile) {
        // Update existing profile
        const updatedProfile = await prisma.profile.update({
          where: { id: existingUser.profile.id },
          data: {
            phone: data.phone,
            location: data.location,
            languages: JSON.stringify(data.languages || []),
            age: data.age ? Number(data.age) : null,
            education: data.education,
            interests: JSON.stringify(data.interests || []),
            goals: data.goals,
            expertise: data.expertise,
            experience: data.experience,
            bio: data.bio,
            availability: data.availability,
            avatarUrl: data.avatarUrl
          }
        });
        return NextResponse.json({ user: updatedUser, profile: updatedProfile });
      } else {
        // Create new profile for existing user
        const newProfile = await prisma.profile.create({
          data: {
            userId: existingUser.id,
            phone: data.phone,
            location: data.location,
            languages: JSON.stringify(data.languages || []),
            age: data.age ? Number(data.age) : null,
            education: data.education,
            interests: JSON.stringify(data.interests || []),
            goals: data.goals,
            expertise: data.expertise,
            experience: data.experience,
            bio: data.bio,
            availability: data.availability,
            avatarUrl: data.avatarUrl
          }
        });
        return NextResponse.json({ user: updatedUser, profile: newProfile });
      }
    }

    // Create new user and profile
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      }
    });
    
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        phone: data.phone,
        location: data.location,
        languages: JSON.stringify(data.languages || []),
        age: data.age ? Number(data.age) : null,
        education: data.education,
        interests: JSON.stringify(data.interests || []),
        goals: data.goals,
        expertise: data.expertise,
        experience: data.experience,
        bio: data.bio,
        availability: data.availability,
        avatarUrl: data.avatarUrl
      }
    });
    
    return NextResponse.json({ user, profile });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 