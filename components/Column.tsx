'use client'
import { Task } from '../types'
import TaskCard from './TaskCard'

export default function Column({
  title,
  colorClass,
  status,
  tasks,
  onDropTask,
  small = false
}: {
  title: string;
  colorClass: string;
  status: Task['status'];
  tasks: Task[];
  onDropTask: (id: string, status: Task['status']) => void;
  small?: boolean; // ✅ NEW prop
}) {
  return (
    <div
      className={`
        flex-1 
        min-w-[180px] sm:min-w-[190px] 
        max-w-full 
        flex flex-col 
        ${small ? "text-xs" : "text-sm"}
      `}
    >
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
        className="
          rounded-2xl 
          border 
          bg-card bg-opacity-50 
          dark:bg-card-dark 
          flex flex-col flex-1
          transition-all duration-200
          hover:shadow-md
        "
        style={{
          backgroundColor: 'var(--card-color)',
          borderColor: 'rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div
          className={`
            px-2 sm:px-3 
            py-2 
            font-semibold 
            flex items-center gap-2 
            border-b 
            ${small ? "text-[11px]" : "text-xs sm:text-sm"}
          `}
          style={{
            color: 'var(--text-color)',
            borderColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <span className={`h-2 w-2 rounded-full ${colorClass}`}></span>
          <span className="truncate">{title}</span>
          <div
            className="ml-auto text-[10px] sm:text-[11px]"
            style={{ color: 'var(--text-color)' }}
          >
            {tasks.length}
          </div>
        </div>

        {/* Tasks area → flex grows naturally */}
        <div
          className="
            p-1 sm:p-2 
            flex flex-col gap-5 flex-1 
            overflow-y-auto
            scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
          "
        >
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}

          {tasks.length === 0 && (
            <div className="text-[10px] sm:text-xs text-muted-foreground text-center py-4 italic">
              No tasks
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
