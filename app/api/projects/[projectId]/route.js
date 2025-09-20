import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "../../../../lib/mongodb";  // fixed path
import { Project } from "../../../../models/models";
import { NextResponse } from "next/server";


const JWT_SECRET = process.env.JWT_SECRET;

function requireAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { error: "No auth token cookie found.", status: 401 };

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.id };
  } catch (_e) {
    return { error: "Invalid or expired token.", status: 401 };
  }
}

// 🔹 GET /api/projects/[id]
export async function GET(_request, { params }) {
  await dbConnect();
  const auth = requireAuth();
  if (auth.error)
    return NextResponse.json({ message: auth.error }, { status: auth.status });

  const project = await Project.findOne({
    _id: params.id,
    owner: auth.userId, // ✅ fix: was "user"
  }).lean();

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ data: project });
}

// 🔹 PUT /api/projects/[id]
export async function PUT(request, { params }) {
  await dbConnect();
  const auth = requireAuth();
  if (auth.error)
    return NextResponse.json({ message: auth.error }, { status: auth.status });

  const body = await request.json();
  const { name, description, route } = body;

  const project = await Project.findOneAndUpdate(
    { _id: params.id, owner: auth.userId }, // ✅ fix: was "user"
    { name, description, route },
    { new: true }
  );

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: project });
}

// 🔹 DELETE /api/projects/[id]
export async function DELETE(_request, { params }) {
  await dbConnect();
  const auth = requireAuth();
  if (auth.error)
    return NextResponse.json({ message: auth.error }, { status: auth.status });

  const deleted = await Project.findOneAndDelete({
    _id: params.id,
    owner: auth.userId, // ✅ fix: was "user"
  });

  if (!deleted) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
