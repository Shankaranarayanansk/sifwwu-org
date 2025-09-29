import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import Leader from '@/lib/models/Leader';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { z } from 'zod';

const leaderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  bio: z.string().optional(),
  image: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export async function GET() {
  try {
    await connectToDatabase();
    const leaders = await Leader.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ leaders });
  } catch (error) {
    console.error('Leaders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaders' }, { status: 500 });
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
    const leaderData = leaderSchema.parse(body);

    await connectToDatabase();
    const leader = new Leader(leaderData);
    await leader.save();

    return NextResponse.json({ message: 'Leader created successfully', leader });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Leader creation error:', error);
    return NextResponse.json({ error: 'Failed to create leader' }, { status: 500 });
  }
}