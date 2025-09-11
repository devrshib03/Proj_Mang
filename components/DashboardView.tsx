// src/components/DashboardView.tsx
"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Settings } from "lucide-react";

export default function DashboardView() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const stats = [
    { label: "Tasks Completed", value: 0, total: 1 },
    { label: "In Progress", value: 0, total: 0 },
    { label: "Overdue", value: 0, total: 0 },
    { label: "Team Members", value: 1, total: 1 },
  ];

  const COLORS = ["#3b82f6", "#fbbf24", "#ef4444", "#10b981"];
  const taskData = [{ name: "Todo", value: 1 }];

  const activities = [
    { id: 1, text: '"TEST TASK"', time: "less than a minute ago" },
    { id: 2, text: ' "First PROJECT"', time: "1 minute ago" },
  ];

  const timeline = [
    {
      id: 1,
      title: "TEST TASK",
      description: "Description of the task goes here.",
      date: "Feb 20, 2025",
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-white text-gray-900 dark:bg-brand-bg dark:text-brand-text transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">FIRST PROJECT</h1>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition">
            + New Task
          </button>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-brand-border dark:hover:bg-brand-card transition">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Team Members */}
      <div className="rounded-2xl p-4 border bg-white text-gray-900 border-gray-200 dark:bg-brand-card dark:border-brand-border dark:text-brand-text transition">
        <h2 className="text-lg font-medium mb-2">Team Members</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
            C
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const percentage =
            stat.total > 0 ? Math.round((stat.value / stat.total) * 100) : 0;

          return (
            <div
              key={idx}
              className="rounded-2xl p-4 flex flex-col items-center border bg-white text-gray-900 border-gray-200 dark:bg-brand-card dark:border-brand-border dark:text-brand-text transition"
            >
              <p className="text-sm text-gray-600 dark:text-brand-text/70 mb-1">
                {stat.label}
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: COLORS[idx % COLORS.length] }}
              >
                {percentage}%
              </p>
              <p className="text-sm text-gray-500 dark:text-brand-text/60">
                {stat.value}/{stat.total} {stat.label.toLowerCase()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-300 dark:border-brand-border">
        {["overview", "timeline", "activity"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition ${
              activeTab === tab
                ? "bg-emerald-500 text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-brand-text dark:hover:bg-brand-card"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Task Distribution */}
          <div className="rounded-2xl p-4 border bg-white text-gray-900 border-gray-200 dark:bg-brand-card dark:border-brand-border dark:text-brand-text transition">
            <h3 className="font-bold mb-4">Task Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={taskData}
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {taskData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-center text-gray-500 dark:text-brand-text/60 mt-2">
              Showing total task count for the project
            </p>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl p-4 border bg-white text-gray-900 border-gray-200 dark:bg-brand-card dark:border-brand-border dark:text-brand-text transition">
            <h3 className="font-bold mb-4">Recent Activity</h3>
            <ul className="space-y-2">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="p-2 rounded-lg border bg-gray-50 text-sm border-gray-200 dark:bg-brand-bg dark:border-brand-border transition"
                >
                  <p>{activity.text}</p>
                  <span className="text-xs text-gray-500 dark:text-brand-text/60">
                    {activity.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Comments */}
          <div className="rounded-2xl p-4 border bg-white text-gray-900 border-gray-200 dark:bg-brand-card dark:border-brand-border dark:text-brand-text transition">
            <h3 className="font-bold mb-4">Recent Comments</h3>
            <p className="text-sm text-gray-500 dark:text-brand-text/60">
              No comments yet
            </p>
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="space-y-4">
          {timeline.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-4 border rounded-xl bg-white dark:bg-brand-card dark:border-brand-border transition"
            >
              <div className="w-3 h-3 mt-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-brand-text/70">
                  {item.description}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-brand-text/60">
                {item.date}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-4 border rounded-xl bg-white dark:bg-brand-card dark:border-brand-border transition"
            >
              <div className="w-10 h-10 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                L
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.text}</p>
                <span className="text-xs text-gray-500 dark:text-brand-text/60">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
