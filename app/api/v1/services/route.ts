import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import Service from '@/lib/models/Service';
import { z } from 'zod';
import { authMiddleware } from '@/lib/middleware/auth';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export async function GET() {
  try {
    await connectToDatabase();
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Services fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = await authMiddleware(request);
    if (authResponse.status !== 200) return authResponse;

    const body = await request.json();
    const serviceData = serviceSchema.parse(body);

    await connectToDatabase();
    const service = new Service(serviceData);
    await service.save();

    return NextResponse.json({ message: 'Service created successfully', service });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Service creation error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
