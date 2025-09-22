"use client";

import { useEffect, useMemo, useState } from "react";
import { Task } from "../types";
import Column from "./Column";

// ✅ normalize helper
const normalizeStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "todo":
      return "Todo";
    case "in progress":
    case "inprogress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "backlog":
      return "Backlog";
    case "blocked":
      return "Blocked";
    case "in review":
    case "inreview":
      return "In Review";
    default:
      return "Todo"; // fallback
  }
};

export default function KanbanBoard({ projectId }: { projectId?: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch tasks
 const fetchTasks = async () => {
  setLoading(true);
  try {
    const res = await fetch(
      projectId ? `/api/projects/${projectId}/tasks` : "/api/tasks",
      {
        cache: "no-store",
        credentials: "include", // 🔹 ensures cookies/session are sent
      }
    );
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = await res.json();
    setTasks(data?.data || []);
  } catch (err) {
    console.error("Error loading tasks:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // 🔹 Group tasks by status
  const groups = useMemo(
    () => ({
      Todo: tasks.filter((t) => normalizeStatus(t.status) === "Todo"),
      "In Progress": tasks.filter(
        (t) => normalizeStatus(t.status) === "In Progress"
      ),
      Completed: tasks.filter((t) => normalizeStatus(t.status) === "Completed"),
      Backlog: tasks.filter((t) => normalizeStatus(t.status) === "Backlog"),
      Blocked: tasks.filter((t) => normalizeStatus(t.status) === "Blocked"),
      "In Review": tasks.filter(
        (t) => normalizeStatus(t.status) === "In Review"
      ),
    }),
    [tasks]
  );

  // 🔹 Drop handler
  const handleDropTask = async (id: string, newStatus: Task["status"]) => {
  setTasks((prev) =>
    prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
  );

  try {
    await fetch(`/api/projects/${projectId}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔹 keep session
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (err) {
    console.error("❌ Failed to update task:", err);
  }
};


  return (
    <div className="grid grid-cols-6 gap-4">
      {Object.entries(groups).map(([status, items]) => (
        <Column
          key={status}
          title={status}
          status={status}
          tasks={items}
          onDropTask={handleDropTask}
          colorClass="bg-blue-500"
        />
      ))}
    </div>
  );
}
