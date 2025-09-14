// lib/storage.ts
import { Task, Comment } from "../types";

const STORAGE_KEY = "tasks_v1";

function safeParse<T>(raw: string | null): T | null {
  try {
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadTasks(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParse<Task[]>(raw) ?? [];
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  // 🔹 Notify all listeners in the same tab
  window.dispatchEvent(new Event("tasksUpdated"));
}

export function addTask(task: Task) {
  const tasks = loadTasks();
  tasks.unshift(task); // put newest at front
  saveTasks(tasks);
  return task;
}

export function getTaskById(id: string): Task | undefined {
  return loadTasks().find((t) => t.id === id);
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = loadTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  tasks[idx] = {
    ...tasks[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveTasks(tasks);
  return tasks[idx];
}

export function updateTaskStatus(id: string, status: Task["status"]) {
  return updateTask(id, { status });
}

/**
 * 🔹 Add a comment to a specific task and persist to localStorage
 */
export function addComment(taskId: string, author: string, text: string): Comment | null {
  if (!text.trim() || !taskId) return null;

  const tasks = loadTasks();
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return null;

  const comment: Comment = {
    id: crypto.randomUUID(),
    author,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  tasks[idx].comments = tasks[idx].comments
    ? [comment, ...tasks[idx].comments] // newest first
    : [comment];

  tasks[idx].updatedAt = new Date().toISOString();

  saveTasks(tasks);

  return comment;
}

export function deleteTask(id: string) {
  const tasks = loadTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
}
