'use client'
import { Task } from '../types'

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className="rounded-2xl p-3 cursor-grab active:cursor-grabbing select-none 
                 bg-card dark:bg-card-dark border border-border dark:border-border-dark"
      style={{
        backgroundColor: 'var(--card-color)',
        color: 'var(--text-color)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Title and Due Date */}
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-sm truncate">{task.title}</div>
        <div className="text-xs text-text dark:text-text-dark whitespace-nowrap">
          {task.dueDate ?? ''}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div
          className="text-xs mt-2 line-clamp-2 text-text dark:text-text-dark"
          style={{ color: 'var(--text-color)' }}
        >
          {task.description}
        </div>
      )}

      {/* Labels and Assignees */}
      <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-1 text-xs">
          {task.labels?.map((l) => (
            <span
              key={l}
              className="px-2 py-0.5 rounded-full bg-blue-800 text-white text-[11px]"
            >
              {l}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {task.assignees?.slice(0, 3).map((a) => (
            <div
              key={a}
              className="h-6 w-6 rounded-full flex items-center justify-center text-[11px]"
              style={{
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
              }}
            >
              {a[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3 text-xs text-text dark:text-text-dark">
          <details>
            <summary className="cursor-pointer list-none">
              Subtasks ({task.subtasks.filter((s) => s.done).length}/{task.subtasks.length})
            </summary>
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {task.subtasks.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-[13px]">
                  <input type="checkbox" checked={s.done} readOnly />
                  <div
                    className={`truncate ${s.done ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                    style={{ color: 'var(--text-color)' }}
                  >
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
