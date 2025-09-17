"use client";

import DashboardView from "components/DashboardView";
import KanbanBoard from "components/KanbanBoard";
import Tableview from "components/Tableview";
import ViewTabs from "components/ViewTabs";
import Timeline from "components/Timeline";
import { useState } from "react";

type View = "dashboard" | "table" | "kanban" | "timeline";

interface DashboardHomePageProps {
  project?: {
    id: string;
    name: string;
    description: string;
    tasks?: any[];
  };
}

export default function DashboardHomePage({ project }: DashboardHomePageProps) {
  // const [view, setView] = useState<View>("dashboard");

  const title = project ? project.name : "Projects";
  const subtitle = project
    ? project.description || "Manage your project tasks here."
    : "Manage all your tasks in one place.";

  const tasks = project?.tasks || [];

  return (
    <div id="dashboard">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-brand-sub dark:text-gray-400">{subtitle}</p>
        {/* <ViewTabs view={view} setView={setView} /> */}
      </div>

      {/* {view === "dashboard" && <DashboardView  projectId={project?.id} />}
      {view === "table" && <Tableview tasks={tasks}  projectId={project?.id} />}

      {view === "kanban" && <KanbanBoard tasks={tasks} projectId={project?.id} />}
      {view === "timeline" && <Timeline tasks={tasks} projectId={project?.id} />} */}
    </div>
  );
}
