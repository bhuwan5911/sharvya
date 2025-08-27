import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
    include: { profile: true, quizzes: true, achievements: true, voiceRecords: true }
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const user = await prisma.user.update({
    where: { id: Number(params.id) },
    data
  });
  return NextResponse.json(user);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.user.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
} 