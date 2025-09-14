import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '/lib/mongodb';
import { User } from 'models/models';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  await dbConnect();
  
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch the latest user data from the database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
        return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    // This will catch invalid or expired tokens
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
  }
}
