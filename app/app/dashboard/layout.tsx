"use client";

import Sidebar from "components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Shared Sidebar */}
      <Sidebar />

      {/* Page content */}
      <main className="flex-1 overflow-x-auto p-6 relative">
        {children}
      </main>
    </div>
  );
}
