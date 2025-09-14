"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadTasks } from "../../../lib/storage";
import TaskDetails from "../../../components/Taskdetails";
import type { Task } from "../../../types";

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const tasks = loadTasks();
    const found = tasks.find((t) => t.id === id);
    setTask(found || null);
  }, [id]);

  if (!task) {
    return <div className="p-6">Task not found</div>;
  }

  return <TaskDetails task={task} />;
}
