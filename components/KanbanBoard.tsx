"use client";

import { useEffect, useMemo, useState } from "react";
import { Task } from "../types";
import Column from "./Column";
import {
  loadTasks,
  updateTaskStatus,
  addTask,
  deleteTask,
} from "../lib/storage";

interface KanbanBoardProps {
  projectId?: string; // 🔹 make board aware of project
}

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // 🔹 Load tasks for this project + listen for updates
  useEffect(() => {
    const sync = (e?: Event) => {
      // only update if event is for this project (or global if no projectId)
      if (
        e &&
        "detail" in e &&
        projectId &&
        (e as CustomEvent).detail?.projectId !== projectId
      ) {
        return;
      }
      setTasks(loadTasks(projectId));
    };

    sync(); // initial load
    window.addEventListener("tasksUpdated", sync as EventListener);
    window.addEventListener("storage", () => sync()); // ✅ handle cross-tab changes

    return () => {
      window.removeEventListener("tasksUpdated", sync as EventListener);
      window.removeEventListener("storage", () => sync());
    };
  }, [projectId]);

  // 🔹 Group tasks by status (memoized)
  const groups = useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === "todo"),
      inprogress: tasks.filter((t) => t.status === "inprogress"),
      completed: tasks.filter((t) => t.status === "completed"),
      backlog: tasks.filter((t) => t.status === "backlog"),
      blocked: tasks.filter((t) => t.status === "blocked"),
      inreview: tasks.filter((t) => t.status === "inreview"),
    }),
    [tasks]
  );

  // 🔹 Handle drag & drop (persist + auto-sync)
  const handleDrop = (id: string, status: Task["status"]) => {
    updateTaskStatus(id, status, projectId);
    // ❌ don't manually setTasks — let storage + event handle it
  };

  // 🔹 Example: Add a new task
  const handleAddTask = () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: "New Task",
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };

    addTask(newTask, projectId); // ✅ this saves permanently
  };

  // 🔹 Example: Delete a task
  const handleDeleteTask = (id: string) => {
    deleteTask(id, projectId); // ✅ this saves permanently
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
      {/* Action buttons for demo */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          + Add Task
        </button>
      </div>

      {/* Grid auto-fits columns instead of forcing horizontal scroll */}
      <div
        className="
          grid gap-6
          gap-y-6 gap-x-4 
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
