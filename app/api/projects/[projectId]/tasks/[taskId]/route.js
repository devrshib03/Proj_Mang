import { NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/mongodb";
import { Task, Project } from "../../../../../../models/models"; // ✅ import Project
import { requireAuth } from "../../../../../../lib/auth";

// 🔹 GET single task
export async function GET(_req, { params }) {
  await dbConnect();
  const { projectId, taskId } = params;
  const auth = requireAuth();

  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    // 🔹 Find actual project by projectId (human-readable like PRJ-XXXX)
    const project = await Project.findOne({ projectId });
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // 🔹 Fetch task belonging to this project
    const task = await Task.findOne({ _id: taskId, project: project._id });
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(task, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching task:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// 🔹 PATCH update task
export async function PATCH(req, { params }) {
  await dbConnect();
  const { projectId, taskId } = params;
  const auth = requireAuth();

  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();

    // 🔹 Find actual project by projectId
    const project = await Project.findOne({ projectId });
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // 🔹 Use project._id (ObjectId) in Task query
    const updated = await Task.findOneAndUpdate(
      { _id: taskId, project: project._id },
      { $set: { status: body.status } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error("❌ Error updating task:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
