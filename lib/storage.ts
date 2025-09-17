// lib/storage.ts
import { Task, Comment } from "../types";

// 🔹 Save tasks for a project
export function saveTasks(tasks: Task[], projectId?: string) {
  const key = projectId ? `tasks-${projectId}` : "tasks";
  localStorage.setItem(key, JSON.stringify(tasks));

  // notify others
  window.dispatchEvent(
    new CustomEvent("tasksUpdated", { detail: { projectId } })
  );
}

// 🔹 Load tasks for a project
export function loadTasks(projectId?: string): Task[] {
  const key = projectId ? `tasks-${projectId}` : "tasks";
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

// 🔹 Add task
export function addTask(task: Task, projectId?: string): Task {
  const tasks = loadTasks(projectId);
  const updated = [task, ...tasks];
  saveTasks(updated, projectId);
  return task;
}

// 🔹 Update task status
export function updateTaskStatus(
  id: string,
  status: Task["status"],
  projectId?: string
) {
  const tasks = loadTasks(projectId);
  const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t));
  saveTasks(updated, projectId);
}

// 🔹 Add comment
export function addComment(
  taskId: string,
  author: string,
  text: string,
  projectId?: string
): Comment | null {
  if (!text.trim()) return null;

  const tasks = loadTasks(projectId);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  const comment: Comment = {
    id: Date.now().toString(),
    text,
    author,
    createdAt: new Date().toISOString(),
    taskId,
  };

  task.comments = [comment, ...(task.comments || [])];
  saveTasks(tasks, projectId);
  return comment;
}
