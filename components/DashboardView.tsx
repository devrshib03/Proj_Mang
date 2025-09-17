"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  PieLabelRenderProps,
} from "recharts";
import {
  Settings,
  Plus,
  X,
  Briefcase,
  ListTodo,
  BarChart2,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Task } from "../types";
import { addTask, loadTasks } from "../lib/storage"; // ✅ use storage helpers

// ✅ Props coming from DashboardHomePage
interface DashboardViewProps {
  tasks?: Task[];
  projectId?: string;
}

interface TaskFormData {
  title: string;
  assignee: string;
  priority: "High" | "Medium" | "Low";
  startDate: string;
  dueDate: string;
  status:
    | "To Do"
    | "In Progress"
    | "Blocked"
    | "Completed"
    | "In Review"
    | "Backlog";
  description: string;
}

interface Activity {
  id: string;
  text: string;
  time: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
}

const COLORS = [
  "#3b82f6",
  "#fbbf24",
  "#ef4444",
  "#10b981",
  "#a855f7",
  "#6b7280",
];

const mockData = {
  teamMembers: [
    { name: "Unassigned", email: "" },
    { name: "Bhakti", email: "bhakti@example.com" },
    { name: "Ashutosh", email: "ashutosh@example.com" },
    { name: "You", email: "you@example.com" },
  ],
};

// 📊 Format Pie Chart data
const formatDataForPieChart = (tasks: Task[]) => {
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const totalTasks = data.reduce((sum, entry) => sum + entry.value, 0);

  return {
    data: data.map((entry, index) => ({
      ...entry,
      color: COLORS[index % COLORS.length],
    })),
    total: totalTasks,
  };
};

function PieChartWithCenterLabelRaw({
  data,
  total,
}: {
  data: any[];
  total: number;
}) {
  const renderLabel = ({ cx, cy }: PieLabelRenderProps) => (
    <text
      x={cx}
      y={cy}
      dy={8}
      textAnchor="middle"
      fill="#333"
      className="font-bold text-2xl dark:text-white"
    >
      {total}
    </text>
  );

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <Label content={renderLabel} position="center" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

const PieChartWithCenterLabel = dynamic(
  () => Promise.resolve(PieChartWithCenterLabelRaw),
  { ssr: false }
);

export default function DashboardView({
  tasks: initialTasks = [],
  projectId,
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    assignee: "",
    priority: "Medium",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    status: "To Do",
    description: "",
  });

  const storageKey = projectId ? `tasks_${projectId}` : "tasks_global";

  // ✅ Load tasks per project
  useEffect(() => {
    setTasks(loadTasks(projectId));

    const savedActivities = localStorage.getItem(`activities_${projectId}`);
    const savedTimeline = localStorage.getItem(`timeline_${projectId}`);
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    if (savedTimeline) setTimeline(JSON.parse(savedTimeline));
  }, [projectId]);

  // ✅ Persist when activities/timeline change
  useEffect(() => {
    localStorage.setItem(`activities_${projectId}`, JSON.stringify(activities));
    localStorage.setItem(`timeline_${projectId}`, JSON.stringify(timeline));
  }, [activities, timeline, projectId]);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const statusMap: Record<string, Task["status"]> = {
      "To Do": "todo",
      "In Progress": "inprogress",
      Blocked: "blocked",
      Completed: "completed",
      "In Review": "inreview",
      Backlog: "backlog",
    };
    const priorityMap: Record<string, Task["priority"]> = {
      High: "high",
      Medium: "medium",
      Low: "low",
    };

  const newTask: Task = {
  id: crypto.randomUUID(),
  title: formData.title,
  assignedTo: formData.assignee ? { name: formData.assignee } : undefined,
  priority: priorityMap[formData.priority] || "medium",
  createdAt: new Date().toISOString(),
  dueDate: formData.dueDate,
  status: statusMap[formData.status] || "todo",
  description: formData.description,
  attachments: 0,
  comments: [],
  projectId: projectId || "global", // ✅ link to project
};


    // ✅ Save using storage helper (syncs with Kanban too)
    addTask(newTask, projectId);
    setTasks(loadTasks(projectId));

    // ✅ Track activities + timeline
    setActivities((prev) => [
      {
        id: crypto.randomUUID(),
        text: `Created task "${newTask.title}"`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    setTimeline((prev) => [
      {
        id: crypto.randomUUID(),
        title: `Task Created: ${newTask.title}`,
        description: newTask.description,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      },
      ...prev,
    ]);

    toast.success("Task created successfully!");

    setFormData({
      title: "",
      assignee: "",
      priority: "Medium",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      status: "To Do",
      description: "",
    });

    setIsModalOpen(false);
  };

  // 📊 Stats
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(
    (t) => t.status === "completed"
  ).length;
  const inProgressTasksCount = tasks.filter(
    (t) => t.status === "inprogress"
  ).length;
  const overdueTasksCount = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "completed"
  ).length;
  const teamMembersCount = new Set(
    tasks.map((t) => t.assignedTo?.name).filter(Boolean)
  ).size;

  const stats = [
    {
      label: "Tasks Completed",
      value: completedTasksCount,
      total: totalTasksCount,
      icon: <CheckCircle size={24} />,
    },
    {
      label: "In Progress",
      value: inProgressTasksCount,
      total: totalTasksCount,
      icon: <ListTodo size={24} />,
    },
    {
      label: "Overdue",
      value: overdueTasksCount,
      total: totalTasksCount,
      icon: <BarChart2 size={24} />,
    },
    {
      label: "Team Members",
      value: teamMembersCount,
      total: teamMembersCount,
      icon: <Briefcase size={24} />,
      noPercentage: true,
    },
  ];

  const { data: taskDistributionData, total: totalTasks } =
    formatDataForPieChart(tasks);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-white text-gray-900 dark:bg-brand-bg dark:text-brand-text transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          {projectId ? ` ${projectId}` : "Dashboard"}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition flex items-center gap-2"
          >
            <Plus size={18} className="sm:size-5" />
            <span className="hidden sm:inline">New Task</span>
          </button>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-brand-border dark:hover:bg-brand-card transition">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Team Members */}
      <div className="flex gap-2 flex-wrap">
        {[...new Set(tasks.map((t) => t.assignedTo?.name).filter(Boolean))].map(
          (member, idx) => (
            <div
              key={idx}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs sm:text-sm text-white"
            >
              {member?.charAt(0).toUpperCase()}
            </div>
          )
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const percentage =
            stat.total > 0 && !stat.noPercentage
              ? Math.round((stat.value / stat.total) * 100)
              : 0;
          return (
            <div
              key={idx}
              className="rounded-2xl p-4 flex flex-col items-center border bg-white text-gray-900 border-gray-200 dark:bg-brand-card dark:border-brand-border dark:text-brand-text transition"
            >
              <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-text/70 mb-1">
                {stat.label}
              </p>
              <p
                className="text-lg sm:text-2xl font-bold mt-1"
                style={{ color: COLORS[idx % COLORS.length] }}
              >
                {stat.noPercentage ? stat.value : `${percentage}%`}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-brand-text/60 text-center">
                {stat.value}/{stat.total} {stat.label.toLowerCase()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-300 dark:border-brand-border text-sm sm:text-base">
        {"overview timeline activity".split(" ").map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-2 font-medium rounded-t-lg transition ${
              activeTab === tab
                ? "bg-blue-500 text-white"
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
            <PieChartWithCenterLabel
              data={taskDistributionData}
              total={totalTasks}
            />
            <p className="text-xs sm:text-sm text-center text-gray-500 dark:text-brand-text/60 mt-2">
              Showing total task count for the project
            </p>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl p-4 border bg-white text-gray-900 border-gray-200 dark:bg-brand-card dark:border-brand-border dark:text-brand-text transition">
            <h3 className="font-bold mb-4">Recent Activity</h3>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="p-2 rounded-lg border bg-gray-50 text-xs sm:text-sm border-gray-200 dark:bg-brand-bg dark:border-brand-border transition"
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
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {tasks
                .flatMap((t) =>
                  (t.comments || []).map((c) => ({ ...c, taskTitle: t.title }))
                )
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 2)
                .map((c) => (
                  <li
                    key={c.id}
                    className="p-2 rounded-lg border bg-gray-50 text-xs sm:text-sm dark:bg-brand-bg dark:border-brand-border"
                  >
                    <p>{c.text}</p>
                    <span className="text-xs text-gray-500 block">
            {c.author} • {new Date(c.createdAt).toLocaleString()}
          </span>
          <span className="text-xs text-blue-600 dark:text-blue-400">
            on {c.taskTitle}
          </span>
        </li>
      ))}
  </ul>
</div>


        </div>
      )}
{/* timeline */}
      {activeTab === "timeline" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {timeline.map((item) => (
      <div
        key={item.id}
        className="flex flex-col sm:flex-row items-start gap-3 p-4 border rounded-xl 
                   bg-white dark:bg-brand-card dark:border-brand-border transition"
      >
        <div className="w-3 h-3 mt-1.5 sm:mt-2 rounded-full bg-blue-500 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm sm:text-base">{item.title}</h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-text/70 break-words">
            {item.description}
          </p>
        </div>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-brand-text/60 mt-2 sm:mt-0">
          {item.date}
        </span>
      </div>
    ))}
  </div>
)}

{activeTab === "activity" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {activities.map((activity) => (
      <div
        key={activity.id}
        className="flex items-center gap-3 p-4 border rounded-xl 
                   bg-white dark:bg-brand-card dark:border-brand-border transition"
      >
        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-md bg-blue-600 text-white 
                        flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
          L
        </div>
        <div className="flex-1">
          <p className="text-xs sm:text-sm">{activity.text}</p>
          <span className="text-xs text-gray-500 dark:text-brand-text/60">
            {activity.time}
          </span>
        </div>
      </div>
    ))}
  </div>
)}

      {/* Modal */}
  <AnimatePresence>
  {isModalOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-brand-card p-6 sm:p-8 rounded-lg shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 dark:text-brand-text/70 hover:text-black dark:hover:text-white"
          onClick={() => setIsModalOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Create New Task
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Name */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-brand-text/70"
              >
                Task Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-brand-bg 
                           border border-gray-300 dark:border-brand-border 
                           rounded-lg focus:ring-emerald-500 focus:border-emerald-500 
                           text-gray-900 dark:text-brand-text text-sm sm:text-base"
                placeholder="Enter task name"
                required
              />
            </div>

            {/* Assignee */}
            <div>
              <label
                htmlFor="assignee"
                className="block text-sm font-medium text-gray-700 dark:text-brand-text/70"
              >
                Assignee
              </label>
              <select
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-brand-bg 
                           border border-gray-300 dark:border-brand-border 
                           rounded-lg focus:ring-emerald-500 focus:border-emerald-500 
                           text-gray-900 dark:text-brand-text text-sm sm:text-base"
              >
                {mockData.teamMembers.map((m) => (
                  <option
                    key={m.name}
                    value={m.name}
                    className="bg-white dark:bg-brand-bg text-gray-900 dark:text-brand-text"
                  >
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 dark:text-brand-text/70"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-brand-bg 
                           border border-gray-300 dark:border-brand-border 
                           rounded-lg focus:ring-emerald-500 focus:border-emerald-500 
                           text-gray-900 dark:text-brand-text text-sm sm:text-base"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-brand-text/70"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-brand-bg 
                           border border-gray-300 dark:border-brand-border 
                           rounded-lg focus:ring-emerald-500 focus:border-emerald-500 
                           text-gray-900 dark:text-brand-text text-sm sm:text-base"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
                <option value="In Review">In Review</option>
                <option value="Backlog">Backlog</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-brand-text/70"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-brand-bg 
                           border border-gray-300 dark:border-brand-border 
                           rounded-lg focus:ring-emerald-500 focus:border-emerald-500 
                           text-gray-900 dark:text-brand-text text-sm sm:text-base"
              />
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 dark:text-brand-text/70"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-brand-bg 
                           border border-gray-300 dark:border-brand-border 
                           rounded-lg focus:ring-emerald-500 focus:border-emerald-500 
                           text-gray-900 dark:text-brand-text text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-brand-text/70"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-brand-bg 
                         border border-gray-300 dark:border-brand-border 
                         rounded-lg focus:ring-emerald-500 focus:border-emerald-500 
                         text-gray-900 dark:text-brand-text text-sm sm:text-base"
              placeholder="Add your description..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg 
                         text-gray-500 hover:text-gray-700 
                         font-medium text-sm sm:text-base transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 
                         rounded-lg text-white font-medium text-sm sm:text-base transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>






    </div>
  );
}
