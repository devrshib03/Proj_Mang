import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/models';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
    }

    // Login successful, return user data
    return NextResponse.json({ success: true, message: 'Logged in successfully.', user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, message: 'Server error.', error: error.message }, { status: 500 });
  }
}