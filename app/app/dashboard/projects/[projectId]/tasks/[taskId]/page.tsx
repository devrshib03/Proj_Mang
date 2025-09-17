"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadTasks } from "../../../../../../../lib/storage";
import TaskDetails from "../../../../../../../components/TaskDetails"; // ✅ fixed import case
import type { Task } from "../../../../../../../types";

export default function TaskDetailPage() {
  const { projectId, taskId } = useParams(); // get both IDs
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !taskId) return;

    const tasks = loadTasks(projectId as string) || []; // ✅ safe fallback
    const found = tasks.find((t) => t.id === taskId);
    setTask(found || null);
    setLoading(false);
  }, [projectId, taskId]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading task details...</div>;
  }

  if (!task) {
    return <div className="p-6 text-red-500">Task not found</div>;
  }

  return <TaskDetails task={task} />;
}
