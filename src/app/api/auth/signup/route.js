import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/models';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ success: false, message: 'All fields are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ success: false, message: 'User with that email already exists.' }), {
        status: 409, // 409 Conflict
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    return new Response(JSON.stringify({ success: true, message: 'User created successfully.', user: { id: user._id, name: user.name, email: user.email } }), {
      status: 201, // 201 Created
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Server error.', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
