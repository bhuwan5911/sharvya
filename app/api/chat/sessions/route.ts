import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

// GET all chat sessions for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const sessions = await prisma.chatSession.findMany({
      where: {
        participants: {
          some: {
            userId: Number(userId)
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 });
  }
}

// POST create a new chat session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, participants } = body;

    if (!participants || participants.length === 0) {
      return NextResponse.json({ error: 'At least one participant required' }, { status: 400 });
    }

    const session = await prisma.chatSession.create({
      data: {
        name: name || `Chat Session ${new Date().toLocaleString()}`,
        participants: {
          create: participants.map((participant: any) => ({
            userId: participant.userId,
            role: participant.role,
            language: participant.language
          }))
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 });
  }
} 