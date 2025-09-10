
import { Task } from "../types";
const KEY = "kanban.tasks";
export function loadTasks(): Task[] | null { if (typeof window === 'undefined') return null; try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) as Task[] : null; } catch { return null; } }
export function saveTasks(tasks: Task[]) { if (typeof window === 'undefined') return; try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch {} }
