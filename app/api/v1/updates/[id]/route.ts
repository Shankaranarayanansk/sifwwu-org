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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const update = await Update.findById(params.id);
    
    if (!update) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    return NextResponse.json({ update });
  } catch (error) {
    console.error('Update fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch update' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const update = await Update.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!update) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Update updated successfully', update });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Update update error:', error);
    return NextResponse.json({ error: 'Failed to update update' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await connectToDatabase();
    const update = await Update.findByIdAndDelete(params.id);

    if (!update) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Update deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete update' }, { status: 500 });
  }
}