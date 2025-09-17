"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Folder, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  description: string;
  route: string;
}

export default function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showDialog && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showDialog]);

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const saveProjectsToStorage = (newProjects: Project[]) => {
    localStorage.setItem("projects", JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  const generateRoute = (name: string): string => {
    return `/app/dashboard/projects/${name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")}`;
  };

  const validateProjectName = (name: string): string | null => {
    if (!name.trim()) {
      return "Project name cannot be empty";
    }
    if (name.trim().length < 2) {
      return "Project name must be at least 2 characters";
    }
    if (
      projects.some(
        (p) => p?.name && p.name.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      return "Project name already exists";
    }
    return null;
  };

  const handleCreateProject = () => {
    const trimmedName = projectName.trim();
    const validationError = validateProjectName(trimmedName);

    if (validationError) {
      setError(validationError);
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: trimmedName,
      description: description.trim(),
      route: generateRoute(trimmedName),
    };

    const updatedProjects = [...projects, newProject];
    saveProjectsToStorage(updatedProjects);

    // Reset dialog
    setProjectName("");
    setDescription("");
    setError("");
    setShowDialog(false);

    console.log("Project created:", newProject);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setProjectName("");
    setDescription("");
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateProject();
    } else if (e.key === "Escape") {
      handleDialogClose();
    }
  };

  const handleProjectClick = (project: Project) => {
    router.push(project.route);
  };

  return (
    <>
      <aside
        className={`h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700
                    transition-all duration-300 ease-in-out
                    ${open ? "w-64" : "w-16"} flex flex-col`}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div
              className="h-9 w-9 rounded-lg
                          bg-gradient-to-tr from-purple-600 to-blue-500
                          flex items-center justify-center
                          text-white font-bold"
            >
              L
            </div>
            {open && <span className="font-semibold text-sm">Logo</span>}
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-sm p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            {open ? "«" : "»"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            {open && (
              <div className="text-xs uppercase mb-2 opacity-60 font-medium">
                Menu
              </div>
            )}
            <ul className="space-y-1">
              {[
                { name: "Home", route: "/app/dashboard" },
                { name: "My Tasks", route: "/app/my-task" },
                { name: "Members", route: "/app/members" },
                { name: "Settings", route: "/app/userprofile" }
              ].map((item) => (
                <li
                  key={item.name}
                  onClick={() => router.push(item.route)}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-colors 
                             hover:bg-gray-100 dark:hover:bg-gray-800
                             text-sm font-medium ${!open ? "flex justify-center" : ""}`}
                >
                  {open ? item.name : item.name[0]}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              {open && (
                <div className="text-xs uppercase opacity-60 font-medium">
                  Projects
                </div>
              )}
              <button
                onClick={() => setShowDialog(true)}
                className={`p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 
                           transition-colors text-purple-600 hover:text-purple-700 
                           dark:text-purple-400 dark:hover:text-purple-300 ${!open ? "mx-auto" : ""}`}
                title="Create Project"
                aria-label="Create new project"
              >
                <Plus size={16} />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className={`text-sm opacity-60 ${!open ? "hidden" : "px-3 py-2"}`}>
                No projects
              </div>
            ) : (
              <ul className="space-y-1">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition-colors 
                               hover:bg-gray-100 dark:hover:bg-gray-800
                               text-sm font-medium flex items-center gap-2 ${!open ? "justify-center" : ""}`}
                    title={!open ? `${project.name} (${project.route})` : project.route}
                  >
                    <Folder
                      size={16}
                      className="text-purple-600 dark:text-purple-400 flex-shrink-0"
                    />
                    {open && <span className="truncate">{project.name}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </aside>

      {/* Project Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[500px] max-w-[90vw] mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Create New Project
              </h3>
              <button
                onClick={handleDialogClose}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label
                  htmlFor="projectName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Project Name
                </label>
                <input
                  ref={inputRef}
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter project name..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           placeholder-gray-500 dark:placeholder-gray-400"
                />
                {error && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter project description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
              </div>

              {projectName && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Route:{" "}
                  <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">
                    {generateRoute(projectName)}
                  </code>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleDialogClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 
                         hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
                         disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
