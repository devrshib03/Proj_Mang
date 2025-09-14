import { NextResponse } from 'next/server';
import dbConnect from '/lib/mongodb';
import { User, Team } from 'models/models';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function PUT(req) {
  // --- Enhanced Debugging ---
  // This will show you in the terminal if your .env.local file is being read.
  if (!process.env.JWT_SECRET) {
    console.error('🔴 FATAL ERROR: JWT_SECRET is not defined. Check your .env.local file and restart the server.');
    return NextResponse.json(
      { success: false, message: 'Server configuration error: JWT secret is missing.' },
      { status: 500 }
    );
  } else {
    // This confirms the secret is loaded. For security, we only log that it exists.
    console.log('✅ JWT_SECRET is loaded.');
  }

  await dbConnect();

  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    // The verification happens here. If the secret is wrong, it will fail.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();
    const { name, email, role, team } = body;

    let teamId = null;
    if (team) {
      let teamDoc = await Team.findOne({ name: team });
      if (!teamDoc) {
        const anyUser = await User.findOne();
        teamDoc = await Team.create({ name: team, owner: anyUser ? anyUser._id : userId });
      }
      teamId = teamDoc._id;
    }

    const updateData = { name, email, role };
    if (teamId) {
      updateData.team = teamId;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password')
      .populate('team');

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const userResponse = {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        team: updatedUser.team ? updatedUser.team.name : 'Default Team'
    };

    return NextResponse.json({ success: true, message: 'Profile updated successfully!', user: userResponse });

  } catch (error) {
    console.error('Profile update API error:', error);
    if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ success: false, message: `Authentication error: ${error.message}. Please log out and log in again.` }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Server error occurred during profile update.' }, { status: 500 });
  }
}

