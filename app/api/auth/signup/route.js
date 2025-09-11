// src/app/api/auth/signup/route.js

import { NextResponse } from 'next/server'; // Correct import for Next.js responses
import dbConnect from '/lib/mongodb';
import { User } from 'models/models';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  console.log('--- API Request Received ---');
  await dbConnect();
  console.log('--- Database Connected ---');

  try {
    const { email, password, name } = await req.json();
    console.log('--- Request Body:', { email, password, name });

    if (!email || !password || !name) {
      // Return a 400 error for missing fields
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    console.log('--- Existing User:', existingUser);
    if (existingUser) {
      // Return a 409 error for an existing user
      return NextResponse.json({ success: false, message: 'User with that email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('--- Password Hashed Successfully ---');
    const user = await User.create({ email, password: hashedPassword, name });
    console.log('--- User Created:', user);

    // Return a 201 success response
    return NextResponse.json({ success: true, message: 'User created successfully.', user: { id: user._id, name: user.name, email: user.email } }, { status: 201 });

  } catch (error) {
    // This will log the specific error causing the 500 status.
    console.error('API Error:', error); 
    return NextResponse.json({ success: false, message: 'Server error.', error: error.message }, { status: 500 });
  }
}