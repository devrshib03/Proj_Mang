'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label, PieLabelRenderProps } from "recharts";
import { Settings, Plus, X, User, Briefcase, ListTodo, BarChart2, CheckCircle, Clock, XCircle, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';

// Define the shape of a task object
interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  startDate: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Blocked' | 'Completed' | 'In Review' | 'Backlog';
  description: string;
}

// Define the shape of the form data
interface TaskFormData {
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  startDate: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Blocked' | 'Completed' | 'In Review' | 'Backlog';
  description: string;
}

// Define the shape of activity and timeline data
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


// Mock data
const mockData = {
  stats: [
    { label: "Total Projects", value: 0, icon: <Briefcase size={24} />, total: 0 },
    { label: "Total Tasks", value: 0, icon: <ListTodo size={24} />, total: 0 },
    { label: "My Tasks", value: 0, icon: <BarChart2 size={24} />, total: 0 },
    { label: "Completed Tasks", value: 0, icon: <CheckCircle size={24} />, total: 0 },
  ],
  teamMembers: [
    { name: 'Unassigned', email: '' },
    { name: 'Bhakti', email: 'bhakti@example.com' },
    { name: 'Ashutosh', email: 'ashutosh@example.com' },
    { name: 'You', email: 'you@example.com' },
  ],
  recentMembers: [
    { name: 'Codewave', email: 'codewave@santosh.com', joinDate: '19/02/2025' },
  ],
  recentProjects: [
    { name: 'Website Redesign', lastUpdate: '1 day ago' },
  ]
};

const COLORS = ["#3b82f6", "#fbbf24", "#ef4444", "#10b981", "#a855f7", "#6b7280"];

const formatDataForPieChart = (tasks: Task[]) => {
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
  }));

  const totalTasks = data.reduce((sum, entry) => sum + entry.value, 0);

  return {
    data: data.map((entry, index) => ({
      ...entry,
      color: COLORS[index % COLORS.length]
    })),
    total: totalTasks
  };
};

const PieChartWithCenterLabel = ({ data, total }) => {
  const renderLabel = ({ cx, cy }: PieLabelRenderProps) => {
    return (
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" className="font-bold text-2xl dark:text-white">
        {total}
      </text>
    );
  };

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
};


export default function DashboardView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    assignee: "",
    priority: "Medium",
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    status: "To Do",
    description: "",
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedActivities = localStorage.getItem('activities');
    const savedTimeline = localStorage.getItem('timeline');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    if (savedTimeline) setTimeline(JSON.parse(savedTimeline));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('timeline', JSON.stringify(timeline));
  }, [tasks, activities, timeline]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...formData
    };
    setTasks(prev => [...prev, newTask]);
    setActivities(prev => [{
      id: crypto.randomUUID(),
      text: `Created task "${newTask.title}"`,
      time: new Date().toLocaleTimeString(),
    }, ...prev]);
    setTimeline(prev => [{
      id: crypto.randomUUID(),
      title: `Task Created: ${newTask.title}`,
      description: newTask.description,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }, ...prev]);
    toast.success("Task created successfully!");
    setIsModalOpen(false);
  };
  
  const { data: taskDistributionData, total: totalTasks } = formatDataForPieChart(tasks);
  
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-white text-gray-900 dark:bg-brand-bg dark:text-brand-text transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">FIRST PROJECT</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition flex items-center gap-2"
          >
            <Plus size={20} />
            New Task
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
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
            C
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockData.stats.map((stat, idx) => {
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
            <div className="h-49">
               <PieChartWithCenterLabel data={taskDistributionData} total={totalTasks} />
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
              className="w-full max-w-2xl bg-white dark:bg-brand-card p-8 rounded-lg shadow-2xl relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-600 dark:text-brand-text/70 hover:text-black dark:hover:text-white"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">Create New Task</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Task Name */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">Task Name</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-brand-bg border border-gray-300 dark:border-brand-border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-brand-text"
                      placeholder="Enter task name"
                      required
                    />
                  </div>
                  {/* Assignee */}
                  <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">Assignee</label>
                    <select
                      name="assignee"
                      id="assignee"
                      value={formData.assignee}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-brand-bg border border-gray-300 dark:border-brand-border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-brand-text"
                    >
                      {mockData.teamMembers.map((member, index) => (
                        <option key={index} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Priority */}
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">Priority</label>
                    <select
                      name="priority"
                      id="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-brand-bg border border-gray-300 dark:border-brand-border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-brand-text"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">Status</label>
                    <select
                      name="status"
                      id="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-brand-bg border border-gray-300 dark:border-brand-border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-brand-text"
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
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-brand-bg border border-gray-300 dark:border-brand-border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-brand-text"
                      required
                    />
                  </div>
                  {/* Due Date */}
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-brand-bg border border-gray-300 dark:border-brand-border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-brand-text"
                      required
                    />
                  </div>
                </div>
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-brand-bg border border-gray-300 dark:border-brand-border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-brand-text"
                    placeholder="Add your description..."
                  />
                </div>
                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition"
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