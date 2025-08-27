import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/translationService';

export async function POST(request: NextRequest) {
  try {
    const { text, fromLang, toLang } = await request.json();

    if (!text || !fromLang || !toLang) {
      return NextResponse.json(
        { error: 'Missing required parameters: text, fromLang, toLang' },
        { status: 400 }
      );
    }

    console.log('Translation API called:', { text, fromLang, toLang });

    const translatedText = await translateText(text, fromLang, toLang);

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText: translatedText,
      fromLang,
      toLang,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { 
        error: 'Translation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const fromLang = searchParams.get('from');
  const toLang = searchParams.get('to');

  if (!text || !fromLang || !toLang) {
    return NextResponse.json(
      { error: 'Missing required parameters: text, from, to' },
      { status: 400 }
    );
  }

  try {
    console.log('Translation API GET called:', { text, fromLang, toLang });

    const translatedText = await translateText(text, fromLang, toLang);

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText: translatedText,
      fromLang,
      toLang,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { 
        error: 'Translation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 