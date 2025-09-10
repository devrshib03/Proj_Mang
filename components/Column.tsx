'use client'
import { Task } from '../types'
import TaskCard from './TaskCard'

export default function Column({
  title,
  colorClass,
  status,
  tasks,
  onDropTask
}: {
  title: string;
  colorClass: string;
  status: Task['status'];
  tasks: Task[];
  onDropTask: (id: string, status: Task['status']) => void;
}) {
  return (
    <div className="flex-1 min-w-[260px] max-w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData('text/plain');
          if (id) onDropTask(id, status);
        }}
        className="rounded-2xl overflow-hidden h-full border bg-card bg-opacity-50 dark:bg-card-dark"
        style={{
          backgroundColor: 'var(--card-color)',
          borderColor: 'rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b"
          style={{
            color: 'var(--text-color)',
            borderColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <span className={`h-2 w-2 rounded-full ${colorClass}`}></span>
          {title}
          <div
            className="ml-auto text-xs"
            style={{ color: 'var(--text-color)' }}
          >
            {tasks.length}
          </div>
        </div>

        {/* Tasks area with scroll on overflow */}
        <div className="p-3 flex flex-col gap-3 min-h-[220px] max-h-[calc(100vh-200px)] overflow-y-auto">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>
    </div>
  )
}
