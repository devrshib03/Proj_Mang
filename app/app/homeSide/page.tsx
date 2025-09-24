"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FolderOpen, CheckSquare, List, CheckCircle, Users, Calendar, User } from 'lucide-react';

// Mock data for charts
const tasksByStatus = [
  { name: 'TODO', value: 8, color: '#94a3b8' },
  { name: 'IN_PROGRESS', value: 12, color: '#3b82f6' },
  { name: 'BACKLOG', value: 5, color: '#f59e0b' },
  { name: 'COMPLETED', value: 15, color: '#10b981' },
  { name: 'BLOCKED', value: 3, color: '#ef4444' },
  { name: 'IN_REVIEW', value: 6, color: '#8b5cf6' }
];

const taskCreationTrend = [
  { date: '2025-02-13', tasks: 2 },
  { date: '2025-02-14', tasks: 4 },
  { date: '2025-02-15', tasks: 1 },
  { date: '2025-02-16', tasks: 6 },
  { date: '2025-02-17', tasks: 3 },
  { date: '2025-02-18', tasks: 5 },
  { date: '2025-02-19', tasks: 8 }
];

// Mock data for recent members and projects
const recentMembers = [
  {
    id: 1,
    name: 'Codewave',
    email: 'codewavewithsasinle@gmail.com',
    avatar: 'C',
    joinDate: '19/02/2025'
  }
];

const recentProjects = [
  {
    id: 1,
    name: 'First PROJECT',
    taskCount: 1,
    avatar: 'F',
    createdDate: '19/02/2025'
  }
];

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
}

function StatCard({ title, value, icon, iconColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function HomePageDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Home</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Monitor your workspace activities and projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Projects"
          value={1}
          icon={<FolderOpen className="w-6 h-6 text-white" />}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Total Tasks"
          value={1}
          icon={<List className="w-6 h-6 text-white" />}
          iconColor="bg-orange-500"
        />
        <StatCard
          title="My Tasks"
          value={1}
          icon={<CheckSquare className="w-6 h-6 text-white" />}
          iconColor="bg-purple-500"
        />
        <StatCard
          title="Completed Tasks"
          value={0}
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          iconColor="bg-green-500"
        />
        <StatCard
          title="Team Members"
          value={1}
          icon={<Users className="w-6 h-6 text-white" />}
          iconColor="bg-pink-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks by Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByStatus}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Creation Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Creation Trend</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Task creation trend (last 7 days)</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={taskCreationTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Members</h3>
          <div className="space-y-4">
            {recentMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{member.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {member.joinDate}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{project.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{project.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{project.taskCount} tasks</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {project.createdDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}