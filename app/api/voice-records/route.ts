import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all voice records
export async function GET() {
  const records = await prisma.voiceRecord.findMany({ include: { user: true } });
  return NextResponse.json(records);
}

// POST create a new voice record
export async function POST(request: Request) {
  const data = await request.json();
  const record = await prisma.voiceRecord.create({
    data: {
      url: data.url,
      userId: data.userId
    }
  });
  return NextResponse.json(record);
} 