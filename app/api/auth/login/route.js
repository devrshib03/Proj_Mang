import { NextResponse } from 'next/server';
import dbConnect from '/lib/mongodb';
import { User } from 'models/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// This is the lifetime of the login session token
const TOKEN_MAX_AGE = 60 * 60; // 1 hour in seconds

export async function POST(req) {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined. Check your .env.local file and restart the server.');
    return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
  }

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

    // --- This is the crucial part that was missing ---
    // 1. Create the JWT token containing the user's ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_MAX_AGE,
    });

    // 2. Prepare the response
    const response = NextResponse.json({ 
        success: true, 
        message: 'Logged in successfully.',
        user: { id: user._id, name: user.name, email: user.email } 
    });
    // 3. Set the cookie using Next.js built-in cookies API (more reliable)
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: false, // OK for localhost; switch to true in production
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_MAX_AGE,
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}







// import { NextResponse } from 'next/server';
// import dbConnect from '/lib/mongodb';
// import { User } from 'models/models';
// import bcrypt from 'bcryptjs';

// export async function POST(req) {
//   await dbConnect();

//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
//     }

//     // Login successful, return user data
//     return NextResponse.json({ success: true, message: 'Logged in successfully.', user: { id: user._id, name: user.name, email: user.email } });

//   } catch (error) {
//     console.error('Login API error:', error);
//     return NextResponse.json({ success: false, message: 'Server error.', error: error.message }, { status: 500 });
//   }
// }