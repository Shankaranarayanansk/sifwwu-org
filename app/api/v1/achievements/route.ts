import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import Achievement from '@/lib/models/Achievement';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { z } from 'zod';

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export async function GET() {
  try {
    await connectToDatabase();
    const achievements = await Achievement.find({ isActive: true })
      .sort({ order: 1, date: -1, createdAt: -1 });
    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Achievements fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
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
    const achievementData = achievementSchema.parse(body);

    // Convert date string to Date
    (achievementData as any).date = new Date(achievementData.date);

    await connectToDatabase();
    const achievement = new Achievement(achievementData);
    await achievement.save();

    return NextResponse.json({ message: 'Achievement created successfully', achievement });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Achievement creation error:', error);
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}