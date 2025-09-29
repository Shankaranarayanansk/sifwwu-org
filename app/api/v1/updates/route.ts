import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import Update from '@/lib/models/Update';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['news', 'job', 'announcement']).default('news'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  publishDate: z.string().optional(),
});

export async function GET() {
  try {
    await connectToDatabase();
    const updates = await Update.find({ isActive: true })
      .sort({ isFeatured: -1, publishDate: -1, createdAt: -1 });
    return NextResponse.json({ updates });
  } catch (error) {
    console.error('Updates fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
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
    const updateData = updateSchema.parse(body);

    // Convert publishDate string to Date if provided
    if (updateData.publishDate) {
      (updateData as any).publishDate = new Date(updateData.publishDate);
    }

    await connectToDatabase();
    const update = new Update(updateData);
    await update.save();

    return NextResponse.json({ message: 'Update created successfully', update });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Update creation error:', error);
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 });
  }
}