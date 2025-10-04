'use client';
import { Dispatch, SetStateAction } from 'react';

type View = 'dashboard' | 'table' | 'kanban' | 'timeline';

export default function ViewTabs({
  view,
  setView,
}: {
  view: View;
  setView: Dispatch<SetStateAction<View>>;
}) {
  const tabs: { id: View; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'table', label: 'Table' },
    { id: 'kanban', label: 'Kanban' },
   
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <div
      className="mt-3 overflow-x-auto"
      style={{
        backgroundColor: 'var(--card-color)',
        color: 'var(--text-color)',
      }}
    >
      <div className="inline-flex min-w-max rounded p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            style={{
              backgroundColor:
                view === tab.id ? 'var(--text-color)' : 'transparent',
              color: view === tab.id
                ? 'var(--bg-color)'
                : 'var(--text-color)',
            }}
            className="px-3 py-1 rounded text-sm transition-colors hover:opacity-80 whitespace-nowrap"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
