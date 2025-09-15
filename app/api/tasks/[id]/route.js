import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '/lib/mongodb';
import { Task } from 'models/models';

const JWT_SECRET = process.env.JWT_SECRET;

function requireAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return { error: 'No auth token cookie found.', status: 401 };
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.id };
  } catch (_e) {
    return { error: 'Invalid or expired token.', status: 401 };
  }
}

export async function GET(_request, { params }) {
  await dbConnect();
  const auth = requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  const task = await Task.findOne({ _id: params.id, user: auth.userId }).populate({ path: 'project', select: 'name' });
  if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  return NextResponse.json({ data: task });
}

export async function PATCH(request, { params }) {
  await dbConnect();
  const auth = requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  const payload = await request.json();
  const updated = await Task.findOneAndUpdate(
    { _id: params.id, user: auth.userId },
    { $set: payload },
    { new: true }
  );
  if (!updated) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_request, { params }) {
  await dbConnect();
  const auth = requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  const res = await Task.findOneAndDelete({ _id: params.id, user: auth.userId });
  if (!res) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}


