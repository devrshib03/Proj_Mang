import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import { Project } from "../../../models/models";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function requireAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { error: "No auth token cookie found.", status: 401 };

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.id };
  } catch {
    return { error: "Invalid or expired token.", status: 401 };
  }
}

// 🔹 GET all projects
export async function GET() {
  try {
    await dbConnect();

    const projects = await Project.find()
      .populate("owner", "name email");

    // ✅ wrap response in { data: [...] }
    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 CREATE new project
export async function POST(request) {
  await dbConnect();
  const auth = requireAuth();
  if (auth.error)
    return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const body = await request.json();

    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const projectId = `PRJ-${randomId}`;
    const route = `/app/dashboard/projects/${projectId}`;

    const project = new Project({
      name: body.name,
      description: body.description || "",
      projectId,
      route,
      owner: auth.userId,
    });

    await project.save();

    // ✅ wrap response in { data: project }
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (err) {
    console.error("❌ Failed to create project:", err);
    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
