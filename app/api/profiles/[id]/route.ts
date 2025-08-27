import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const profile = await prisma.profile.findUnique({
    where: { id: Number(params.id) },
    include: { user: true }
  });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const profile = await prisma.profile.update({
    where: { id: Number(params.id) },
    data
  });
  return NextResponse.json(profile);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.profile.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
} 