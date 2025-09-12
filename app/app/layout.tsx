'use client';

// Using the standard Next.js path alias structure
import { UIProvider, useUI } from '../contexts/UIContext';
import Sidebar from 'components/Sidebar';

import type { ReactNode } from 'react';

// This is an inner component that can access the context
// because it's rendered inside UIProvider.
function AppLayoutContent({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUI();
  return (
    <div className="flex">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

// This is the main layout component for the (app) group.
// It wraps everything in the UIProvider.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </UIProvider>
  );
}

