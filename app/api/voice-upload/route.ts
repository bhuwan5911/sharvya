import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const userId = Number(formData.get('userId'));

  if (!file || !userId) {
    return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from('voice-files').upload(fileName, file);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/voice-files/${fileName}`;
  const record = await prisma.voiceRecord.create({
    data: { url, userId }
  });

  return NextResponse.json(record);
} 