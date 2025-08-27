import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const record = await prisma.voiceRecord.findUnique({
    where: { id: Number(params.id) },
    include: { user: true }
  });
  if (!record) return NextResponse.json({ error: 'Voice record not found' }, { status: 404 });
  return NextResponse.json(record);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const record = await prisma.voiceRecord.update({
    where: { id: Number(params.id) },
    data
  });
  return NextResponse.json(record);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.voiceRecord.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
} 