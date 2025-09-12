'use client';
import DashboardView from 'components/DashboardView';
import KanbanBoard from 'components/KanbanBoard';
import Sidebar from 'components/Sidebar';
import Tableview from 'components/Tableview';
import ViewTabs from 'components/ViewTabs';
import { useState } from 'react';
import Timeline from 'components/Timeline';
import Calendar from 'components/Calendar';


type View = 'dashboard' | 'table' | 'kanban' | 'calendar' | 'timeline';

export default function Page() {
  const [view, setView] = useState<View>('kanban');

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <main className="flex-1 overflow-x-auto p-6 relative">
       

        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-brand-sub dark:text-gray-400">
            Manage all your task in one place.
          </p>
          <ViewTabs view={view} setView={setView} />
        </div>

        {view === 'dashboard' && <DashboardView />}
        {view === 'table' && <Tableview />}
        {view === 'kanban' && <KanbanBoard />}
        {view === 'calendar' && <Calendar />}
        {view === 'timeline' && <Timeline />}
      </main>
    </div>

  );
}
