import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

// GET messages for a chat session
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        sessionId: Number(sessionId)
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST create a new message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      sessionId, 
      senderId, 
      originalText, 
      translatedText, 
      originalLanguage, 
      translatedLanguage,
      isVoice 
    } = body;

    if (!sessionId || !senderId || !originalText || !translatedText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId: Number(sessionId),
        senderId: Number(senderId),
        originalText,
        translatedText,
        originalLanguage,
        translatedLanguage,
        isVoice: isVoice || false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Update session's updatedAt timestamp
    await prisma.chatSession.update({
      where: { id: Number(sessionId) },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
} 