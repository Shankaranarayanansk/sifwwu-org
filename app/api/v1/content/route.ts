import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import ContentSection from '@/lib/models/ContentSection';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { z } from 'zod';

const contentSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    await connectToDatabase();
    const content = await ContentSection.find({ isActive: true });
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Content fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const contentData = contentSchema.parse(body);

    await connectToDatabase();
    
    // Update if exists, create if not
    const content = await ContentSection.findOneAndUpdate(
      { key: contentData.key },
      contentData,
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ message: 'Content saved successfully', content });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Content save error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}