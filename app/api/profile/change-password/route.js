import { NextResponse } from 'next/server';
import dbConnect from '/lib/mongodb';
import { User } from 'models/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function PUT(req) {
  await dbConnect();

  try {
    // 1. Verify the user's token to get their ID
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2. Get passwords from the request body
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: 'All password fields are required.' }, { status: 400 });
    }

    // 3. Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 4. Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Incorrect current password.' }, { status: 403 });
    }

    // 5. Hash the new password and save it
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });

  } catch (error) {
    console.error('Change Password API error:', error);
    if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
