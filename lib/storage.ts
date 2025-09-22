// lib/api.ts
import { Task, Comment } from "../types";
import { apiFetch } from "./localAuth";

const API_BASE = "/api/projects";

/* -------------------------------
   Load tasks for a specific project
-------------------------------- */
export async function loadTasks(projectId: string): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/${projectId}/tasks`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to load tasks");

  const data = await res.json().catch(() => ({}));
  return data.data || []; // normalize return
}

/* -------------------------------
   Add a new task to a project
-------------------------------- */
export async function addTask(projectId: string, taskData: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE}/${projectId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) throw new Error("Failed to add task");

  const data = await res.json().catch(() => ({}));
  return data.data || data.task || data;
}

/* -------------------------------
   Update a task's status
-------------------------------- */
export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: Task["status"]
): Promise<Task> {
  const res = await apiFetch(`${API_BASE}/${projectId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update task status");

  return data.data || data.task || data;
}

/* -------------------------------
   Add a comment to a task
-------------------------------- */
export async function addComment(
  projectId: string,
  taskId: string,
  comment: Partial<Comment>
): Promise<Comment> {
  const res = await apiFetch(`${API_BASE}/${projectId}/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify(comment),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to add comment");

  return data.data || data.comment || data;
}
