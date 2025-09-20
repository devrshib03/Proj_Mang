"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TaskDetails from "../../../../../../../components/Taskdetails"; 
import type { Task } from "../../../../../../../types";

export default function TaskDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string; // ✅ string
  const taskId = params.taskId as string;       // ✅ string

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !taskId) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`);
        if (!res.ok) throw new Error("Failed to fetch task");
        const data: Task = await res.json();
        setTask(data);
      } catch (err) {
        console.error("❌ Error loading task:", err);
        setTask(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [projectId, taskId]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading task details...</div>;
  }

  if (!task) {
    return <div className="p-6 text-red-500">Task not found</div>;
  }

  return <TaskDetails task={task} />;
}
