import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const achievement = await prisma.achievement.findUnique({
    where: { id: Number(params.id) },
    include: { user: true }
  });
  if (!achievement) return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
  return NextResponse.json(achievement);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const achievement = await prisma.achievement.update({
    where: { id: Number(params.id) },
    data
  });
  return NextResponse.json(achievement);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.achievement.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
} 