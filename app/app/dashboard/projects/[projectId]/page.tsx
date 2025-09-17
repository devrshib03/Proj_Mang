"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import DashboardView from "../../../../../components/DashboardView";
import KanbanBoard from "../../../../../components/KanbanBoard";
import TableView from "../../../../../components/Tableview";
import TimelineView from "../../../../../components/Timeline";
import { Task } from "../../../../../types";

type Tab = "dashboard" | "table" | "kanban" | "timeline";

export default function ProjectPage() {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [tasks, setTasks] = useState<Task[]>([]);

  
 // ✅ Load tasks for this project
useEffect(() => {
  if (!projectId) return;
  const saved = localStorage.getItem(`tasks_${projectId}`);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Task[];
      setTasks(parsed);
    } catch (err) {
      console.error("Failed to parse tasks from localStorage:", err);
      setTasks([]);
    }
  }
}, [projectId]);


  // ✅ Save tasks whenever they update
  useEffect(() => {
    if (!projectId) return;
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(tasks));
  }, [tasks, projectId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project</h1>

      {/* Tabs */}
      {/* Tabs */}
<div className="flex gap-2 mb-6">
  {["dashboard", "table", "kanban", "timeline"].map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab as Tab)}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        activeTab === tab
          ? "bg-blue-600 text-white dark:bg-white dark:text-black"
          : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
      }`}
    >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  ))}
</div>

      {/* Render active view */}
      {activeTab === "dashboard" && (
        <DashboardView projectId={projectId as string} tasks={tasks} setTasks={setTasks} />
      )}
      {activeTab === "table" && (
        <TableView projectId={projectId as string} tasks={tasks} setTasks={setTasks} />
      )}
      {activeTab === "kanban" && (
        <KanbanBoard projectId={projectId as string} tasks={tasks} setTasks={setTasks} />
      )}
      {activeTab === "timeline" && (
        <TimelineView projectId={projectId as string} tasks={tasks} setTasks={setTasks} />
      )}
    </div>
  );
}
