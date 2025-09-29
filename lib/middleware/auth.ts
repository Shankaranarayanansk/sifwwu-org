import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '../auth/jwt';
import { connectToDatabase } from '../db/connection';
import Admin from '../models/Admin';

export async function authMiddleware(request: NextRequest) {
  try {
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
    const user = await Admin.findById(payload.userId).select('-password');

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 });
    }

    // Return success response for middleware check
    return NextResponse.json({ success: true, user: { id: user._id, role: user.role } });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

export function requireRole(roles: string[]) {
  return (request: NextRequest) => {
    const userRole = request.headers.get('x-user-role');
    
    if (!userRole || !roles.includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    return NextResponse.next();
  };
}