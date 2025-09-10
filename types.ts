
export type Status = 'todo' | 'inprogress' | 'completed' | 'done';
export type Priority = 'LOW'|'MEDIUM'|'HIGH';
export interface Subtask { id: string; title: string; done: boolean; }
export interface Task { id: string; title: string; description?: string; attachments?: string[]; dueDate?: string; labels?: string[]; assignees?: string[]; priority?: Priority; status: Status; subtasks?: Subtask[]; }
