import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all quizzes or filter by userId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    
    if (searchParams.get('userId')) {
      const userId = searchParams.get('userId');
      // Check if userId is a UUID (Supabase user ID) or integer (database user ID)
      if (userId && userId.includes('-')) {
        // It's a UUID, we need to find the user by email first
        // For now, return empty array to avoid errors
        return NextResponse.json([]);
      } else if (userId && !isNaN(Number(userId))) {
        // It's a valid integer (database user ID)
        where.userId = Number(userId);
      } else {
        // Invalid userId, return empty array
        return NextResponse.json([]);
      }
    }
    
    const quizzes = await prisma.quiz.findMany({ where, include: { user: true } });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

// POST create a new quiz
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const quiz = await prisma.quiz.create({
      data: {
        question: data.question,
        answer: data.answer,
        userId: data.userId,
        category: data.category || 'voice-technology',
        difficulty: data.difficulty || 'easy',
        language: data.language || 'en',
        options: JSON.stringify(data.options || []),
        type: data.type || 'voice-mcq',
        points: data.points || 10,
        audioUrl: data.audioUrl || null,
        correctAnswers: data.correctAnswers || 0,
        totalAnswers: data.totalAnswers || 0,
      }
    });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}

// DELETE all quizzes for a user
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  await prisma.quiz.deleteMany({ where: { userId: Number(userId) } });
  return NextResponse.json({ success: true });
} 