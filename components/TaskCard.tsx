"use client";

import { useEffect, useState } from "react";
import { Task, project } from "../types";

const statusColors: Record<string, string> = {
  todo: "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-100",
  inprogress: "bg-blue-500 text-white dark:bg-blue-600",
  blocked: "bg-red-500 text-white dark:bg-red-600",
  completed: "bg-green-500 text-white dark:bg-green-600",
  inreview: "bg-yellow-500 text-white dark:bg-yellow-600",
  backlog: "bg-purple-500 text-white dark:bg-purple-600",
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
    try {
      const stored = JSON.parse(localStorage.getItem("projects") || "[]") as project[];
      const proj = stored.find((p) => p.id === task.projectId);
      if (proj) setProjectName(proj.name);
    } catch {
      setProjectName("—");
    }
  }, [task.projectId]);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow px-3 py-2 cursor-grab active:cursor-grabbing hover:shadow-md flex flex-col justify-between h-auto transition w-full"
    >
      {/* Top Section */}
      <div>
        {/* Task Title */}
        <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-100 line-clamp-2">
          {task.title || "Untitled Task"}
        </div>

        {/* Project Name */}
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
          {projectName}
        </div>
      </div>

      {/* Bottom Section: Badges */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
        {/* Assignee Badge */}
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium min-w-[60px] truncate ${
            task.assignedTo
              ? assigneeColors
              : "bg-gray-200 dark:bg-gray-700 text-gray-400"
          }`}
        >
          {task.assignedTo?.name || "Unassigned"}
        </span>

        {/* Status Badge */}
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium min-w-[60px] truncate ${
            task.status
              ? statusColors[task.status] || "bg-gray-400 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400"
          }`}
        >
          {task.status || "No Status"}
        </span>

        {/* Priority Badge */}
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
