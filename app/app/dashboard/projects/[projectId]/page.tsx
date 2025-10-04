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
  const params = useParams();
  const projectId = params.projectId as string; // ✅ now it's "PRJ-B1AKMA"

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch tasks with projectId
  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/tasks`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data.data || []);
      } catch (err) {
        console.error("❌ Error fetching tasks:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading tasks...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project</h1>

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
        <DashboardView projectId={projectId} tasks={tasks} setTasks={setTasks} />
      )}
      {activeTab === "table" && (
        <TableView projectId={projectId} tasks={tasks} setTasks={setTasks} />
      )}
      {activeTab === "kanban" && (
        <KanbanBoard projectId={projectId} tasks={tasks} setTasks={setTasks} />
      )}
      {activeTab === "timeline" && (
        <TimelineView projectId={projectId} tasks={tasks} setTasks={setTasks} />
      )}
    </div>
  );
}
