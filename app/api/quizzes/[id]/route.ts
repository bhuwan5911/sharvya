import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: Number(params.id) },
    include: { user: true }
  });
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  return NextResponse.json(quiz);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const quiz = await prisma.quiz.update({
    where: { id: Number(params.id) },
    data
  });
  return NextResponse.json(quiz);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.quiz.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
} 