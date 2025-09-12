'use client';
import { useState } from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen 
                 bg-card dark:bg-card-dark text-text dark:text-text-dark 
                 border-r border-gray-200 dark:border-gray-700 
                 transition-all duration-300 ease-in-out 
                 ${open ? 'w-64' : 'w-16'} flex flex-col z-40`}
      style={{
        backgroundColor: 'var(--card-color)',
        color: 'var(--text-color)',
        borderRight: '1px solid var(--border-color)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-lg 
                       bg-gradient-to-tr from-amber-500 to-orange-700 
                       flex items-center justify-center 
                       text-white font-bold"
          >
            L
          </div>
          {open && <span className="font-semibold text-sm">Logo</span>}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {open ? '«' : '»'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          {open && (
            <div className="text-xs uppercase mb-2 opacity-60">Menu</div>
          )}
          <ul className="space-y-1">
            {['Home', 'My Tasks', 'Members', 'Setting'].map((item) => (
              <li
                key={item}
                className={`px-2 py-2 rounded cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  !open ? 'flex justify-center' : ''
                }`}
                style={{ color: 'var(--text-color)' }}
              >
                {open ? item : item[0]}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {open && (
            <div className="text-xs uppercase mb-2 opacity-60">Projects</div>
          )}
          <ul className="space-y-1">
            {['', '', ''].map((proj) => (
              <li
                key={proj}
                className={`px-2 py-2 rounded cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  !open ? 'flex justify-center' : ''
                }`}
                style={{ color: 'var(--text-color)' }}
              >
                {open ? proj : proj[0]}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
