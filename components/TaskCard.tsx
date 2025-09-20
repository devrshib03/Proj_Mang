"use client";

import { useEffect, useState } from "react";
import { Task, Project } from "../types";

const statusColors: Record<string, string> = {
  Todo: "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-100",
  "In Progress": "bg-blue-500 text-white dark:bg-blue-600",
  Blocked: "bg-red-500 text-white dark:bg-red-600",
  Completed: "bg-green-500 text-white dark:bg-green-600",
  "In Review": "bg-yellow-500 text-white dark:bg-yellow-600",
  Backlog: "bg-purple-500 text-white dark:bg-purple-600",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-500 text-white dark:bg-red-600",
  Medium: "bg-yellow-500 text-white dark:bg-yellow-600",
  Low: "bg-green-500 text-white dark:bg-green-600",
};

const assigneeColors = "bg-indigo-500 text-white dark:bg-indigo-600";

export default function TaskCard({ task }: { task: Task }) {
  const [projectName, setProjectName] = useState<string>("—");

useEffect(() => {
  if (!task?.project) return;

  fetch(`/api/projects/${task.project}`, {
    credentials: "include", // 🔹 ensure cookies/session are sent
  })
    .then((res) => res.json())
    .then((proj: Project) => {
      if (proj?.name) setProjectName(proj.name);
    })
    .catch(() => setProjectName("—"));
}, [task?.project]);


  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task._id || task.id);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.classList.add("opacity-50");
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove("opacity-50");
      }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow px-3 py-2 cursor-grab active:cursor-grabbing hover:shadow-md flex flex-col justify-between h-auto transition w-full"
    >
      {/* Top Section */}
      <div>
        <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-100 line-clamp-2">
          {task.title || "Untitled Task"}
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
          {projectName}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium min-w-[60px] truncate ${
            task.user
              ? assigneeColors
              : "bg-gray-200 dark:bg-gray-700 text-gray-400"
          }`}
        >
          {task.user || "Unassigned"}
        </span>

        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium min-w-[60px] truncate ${
            task.status
              ? statusColors[task.status] || "bg-gray-400 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400"
          }`}
        >
          {task.status || "No Status"}
        </span>

        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium min-w-[60px] truncate ${
            task.priority
              ? priorityColors[task.priority] || "bg-gray-400 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800"
          }`}
        >
          {task.priority || "No Priority"}
        </span>
      </div>
    </div>
  );
}
