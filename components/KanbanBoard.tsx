'use client';

import { useEffect, useMemo, useState } from 'react';
import { Task } from '../types';
import Column from './Column';
import { loadTasks, updateTaskStatus } from '../lib/storage';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // 🔹 Load tasks from localStorage on mount + listen for updates
  useEffect(() => {
    const sync = () => {
      const stored = loadTasks();
      setTasks(stored ?? []);
    };

    sync(); // initial load
    window.addEventListener('tasksUpdated', sync);

    return () => window.removeEventListener('tasksUpdated', sync);
  }, []);

  // 🔹 Group tasks by status (memoized)
  const groups = useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === 'todo'),
      inprogress: tasks.filter((t) => t.status === 'inprogress'),
      completed: tasks.filter((t) => t.status === 'completed'),
      backlog: tasks.filter((t) => t.status === 'backlog'),
      blocked: tasks.filter((t) => t.status === 'blocked'),
      inreview: tasks.filter((t) => t.status === 'inreview'),
    }),
    [tasks]
  );

  // 🔹 Handle drag & drop (persist + auto-sync)
  const handleDrop = (id: string, status: Task['status']) => {
    updateTaskStatus(id, status);
    // ❌ don't manually setTasks here — let storage + event drive the sync
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-4">
      {/* Grid auto-fits columns instead of forcing horizontal scroll */}
      <div
        className="
          grid gap-3
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-6
        "
      >
        <Column
          title="To Do"
          colorClass="bg-blue-500"
          status="todo"
          tasks={groups.todo}
          onDropTask={handleDrop}
          small
        />
        <Column
          title="In Progress"
          colorClass="bg-orange-400"
          status="inprogress"
          tasks={groups.inprogress}
          onDropTask={handleDrop}
          small
        />
        <Column
          title="Completed"
          colorClass="bg-purple-500"
          status="completed"
          tasks={groups.completed}
          onDropTask={handleDrop}
          small
        />
        <Column
          title="Backlog"
          colorClass="bg-gray-400"
          status="backlog"
          tasks={groups.backlog}
          onDropTask={handleDrop}
          small
        />
        <Column
          title="Blocked"
          colorClass="bg-red-500"
          status="blocked"
          tasks={groups.blocked}
          onDropTask={handleDrop}
          small
        />
        <Column
          title="In Review"
          colorClass="bg-indigo-500"
          status="inreview"
          tasks={groups.inreview}
          onDropTask={handleDrop}
          small
        />
      </div>
    </div>
  );
}
