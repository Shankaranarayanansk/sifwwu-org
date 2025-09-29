import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import Leader from '@/lib/models/Leader';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { z } from 'zod';

const leaderUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  bio: z.string().optional(),
  image: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const leader = await Leader.findById(params.id);
    
    if (!leader) {
      return NextResponse.json({ error: 'Leader not found' }, { status: 404 });
    }

    return NextResponse.json({ leader });
  } catch (error) {
    console.error('Leader fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch leader' }, { status: 500 });
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
    const updateData = leaderUpdateSchema.parse(body);

    await connectToDatabase();
    const leader = await Leader.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!leader) {
      return NextResponse.json({ error: 'Leader not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Leader updated successfully', leader });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Leader update error:', error);
    return NextResponse.json({ error: 'Failed to update leader' }, { status: 500 });
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
    const leader = await Leader.findByIdAndDelete(params.id);

    if (!leader) {
      return NextResponse.json({ error: 'Leader not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Leader deleted successfully' });
  } catch (error) {
    console.error('Leader deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete leader' }, { status: 500 });
  }
}