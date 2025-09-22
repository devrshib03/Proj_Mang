import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import { Project, Task } from "../../../../../models/models";
import { requireAuth } from "../../../../../lib/auth";

export async function GET(_req, { params }) {
  await dbConnect();
  const { projectId } = params;
  const auth = requireAuth();

  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const project = await Project.findOne({
      $or: [{ projectId }, { route: projectId }, { name: projectId }],
      owner: auth.userId,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const tasks = await Task.find({ project: project._id })
      .populate("user", "name email") // 👈 will return assignee name/email
      .lean();

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}


// 🔹 POST create a new task// POST create a new task
export async function POST(req, { params }) {
  await dbConnect();
  const { projectId } = params;
  const auth = requireAuth();

  if (auth.error)
    return NextResponse.json({ message: auth.error }, { status: auth.status });

  const body = await req.json();

  try {
    const project = await Project.findOne({
      $or: [{ projectId }, { route: projectId }, { name: projectId }],
      owner: auth.userId,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Task title is required" },
        { status: 400 }
      );
    }

    // ✅ Directly assign the string value
    const task = await Task.create({
      title: body.title,
      description: body.description || "",
      status: body.status || "Todo",
      priority: body.priority || "Medium",
      dueDate: body.dueDate || null,
      project: project._id,
      user: body.user || "Unassigned", 
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (err) {
    console.error("❌ Task creation error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
