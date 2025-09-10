'use client';
import { useEffect, useMemo, useState } from 'react';
import { Task } from '../types';
import Column from './Column';
import { loadTasks, saveTasks } from '../lib/storage';

const initial: Task[] = [
  { id: '1', title: 'Design landing', description: 'Create hero section', labels: ['UI'], assignees: ['Ash'], priority: 'MEDIUM', status: 'todo', dueDate: 'Sep 12' },
  { id: '2', title: 'API integration', description: 'Auth endpoints', labels: ['API'], assignees: ['Sam'], priority: 'HIGH', status: 'inprogress', subtasks: [{id:'s1', title:'Auth route', done:false}], dueDate: 'Sep 15' },
  { id: '3', title: 'Write tests', description: 'Unit tests for utils', labels: ['QA'], assignees: ['Jai'], priority: 'LOW', status: 'completed', subtasks: [{id:'s2', title:'setup', done:true}], dueDate: 'Sep 05' },
  { id: '4', title: 'Release v1', description: 'Ship MVP', labels: ['Release'], assignees: ['Ash','Sam'], priority: 'HIGH', status: 'done', dueDate: 'Sep 08' },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initial);

  useEffect(() => {
    const stored = loadTasks();
    if (stored && stored.length) setTasks(stored);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const groups = useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === 'todo'),
      inprogress: tasks.filter((t) => t.status === 'inprogress'),
      completed: tasks.filter((t) => t.status === 'completed'),
      done: tasks.filter((t) => t.status === 'done'),
    }),
    [tasks]
  );

  const handleDrop = (id: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  return (
    <div
      className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6"
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
      }}
    >
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-[800px] sm:min-w-full flex-wrap md:flex-nowrap">
          <Column
            title="To Do"
            colorClass="bg-blue-500"
            status="todo"
            tasks={groups.todo}
            onDropTask={handleDrop}
          />
          <Column
            title="In Progress"
            colorClass="bg-orange-400"
            status="inprogress"
            tasks={groups.inprogress}
            onDropTask={handleDrop}
          />
          <Column
            title="Completed"
            colorClass="bg-purple-500"
            status="completed"
            tasks={groups.completed}
            onDropTask={handleDrop}
          />
          <Column
            title="Done"
            colorClass="bg-emerald-500"
            status="done"
            tasks={groups.done}
            onDropTask={handleDrop}
          />
        </div>
      </div>
    </div>
  );
}
