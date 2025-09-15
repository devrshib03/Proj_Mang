import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '/lib/mongodb';
import { Task, Project, User } from 'models/models';

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

export async function GET(request) {
  await dbConnect();

  const auth = requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10), 1), 100);
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status') || undefined;
  const priority = searchParams.get('priority') || undefined;
  const sortParam = searchParams.get('sort') || 'createdAt:desc';

  const [sortField, sortDir] = sortParam.split(':');
  const allowedSort = new Set(['createdAt', 'dueDate', 'title', 'priority', 'status']);
  const sort = allowedSort.has(sortField) ? { [sortField]: sortDir === 'asc' ? 1 : -1 } : { createdAt: -1 };

  const filter = { user: auth.userId };
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Task.find(filter)
      .populate({ path: 'project', select: 'name' })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Task.countDocuments(filter),
  ]);

  return NextResponse.json({ data: items, page, limit, total });
}

export async function POST(request) {
  await dbConnect();

  const auth = requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  const body = await request.json();
  const { title, description, status, priority, dueDate, projectId } = body || {};

  if (!title) {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    user: auth.userId,
    project: projectId || null,
  });

  return NextResponse.json({ success: true, data: task }, { status: 201 });
}


