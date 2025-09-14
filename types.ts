
export type Status = 'todo' | 'inprogress' | 'completed' | 'done';
export type Priority = 'LOW'|'MEDIUM'|'HIGH';
export interface Subtask { id: string; title: string; done: boolean; }
// export interface Task { id: string; title: string; description?: string; attachments?: string[]; dueDate?: string; labels?: string[]; assignees?: string[]; priority?: Priority; status: Status; subtasks?: Subtask[]; }
// types.ts
export type Comment = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  taskId?: string; // optional link back to the task
};

// your Task type should have `comments?: Comment[];` (or similar)
export type Task = {
  id: string;
  title: string;
  description?: string;
  project?: string;
  assignedTo?: { name: string; initials?: string };
  priority?: string;
  status?: string;
  dueDate?: string;
  createdAt?: string;
  attachments?: number;
  comments?: Comment[]; // <--- ensure this exists
  documentation?: string;
};
