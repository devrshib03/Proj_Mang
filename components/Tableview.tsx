"use client";

import { useState, useEffect, useMemo } from "react";
import { Paperclip, MoreVertical } from "lucide-react";
import { loadTasks } from "../lib/storage";
import type { Task } from "../types";
import Link from "next/link";

interface TableViewProps {
  projectId?: string;
}

export default function TableView({ projectId }: TableViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Task>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // 🔹 Sync tasks with localStorage (per project)
  useEffect(() => {
    const sync = (e?: Event) => {
      const custom = e as CustomEvent<{ projectId?: string }> | undefined;

      // If event has no detail → reload all
      if (!custom?.detail) {
        setTasks(loadTasks(projectId));
        return;
      }

      // Only reload if event is for this project
      if (custom.detail.projectId === projectId) {
        setTasks(loadTasks(projectId));
      }
    };

    sync(); // initial load
    window.addEventListener("tasksUpdated", sync as EventListener);
    window.addEventListener("storage", () => sync()); // ✅ cross-tab sync

    return () => {
      window.removeEventListener("tasksUpdated", sync as EventListener);
      window.removeEventListener("storage", () => sync());
    };
  }, [projectId]);

  // 🔹 Filter + Sort
  const processedTasks = useMemo(() => {
    let data = tasks.filter((t) =>
      t.title.toLowerCase().includes(filter.toLowerCase())
    );
    data = [...data].sort((a, b) => {
      const aVal = a[sortKey] as any;
      const bVal = b[sortKey] as any;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [tasks, filter, sortKey, sortOrder]);

  // 🔹 Pagination
  const paginatedTasks = processedTasks.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // 🔹 Selection
  const toggleAll = () => {
    if (selected.length === paginatedTasks.length) {
      setSelected([]);
    } else {
      setSelected(paginatedTasks.map((t) => t.id));
    }
  };
  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSort = (key: keyof Task) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between p-3 border-b border-gray-200 dark:border-brand-border">
        <input
          type="text"
          placeholder="Filter task title..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-72 px-3 py-1.5 rounded-md border border-gray-300 dark:border-brand-border bg-white dark:bg-brand-bg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-brand-border hover:bg-gray-100 dark:hover:bg-brand-bg">
          Columns
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-brand-bg text-gray-600 dark:text-brand-text/70 text-xs font-medium">
            <tr>
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  checked={
                    selected.length === paginatedTasks.length &&
                    paginatedTasks.length > 0
                  }
                  onChange={toggleAll}
                />
              </th>
              {[
                { key: "title", label: "Task Title" },
                { key: "status", label: "Status" },
                { key: "priority", label: "Priority" },
                { key: "createdAt", label: "Created At" },
                { key: "dueDate", label: "Due Date" },
                { key: "assignedTo", label: "Assigned To" },
                { key: "attachments", label: "Attachments" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left cursor-pointer select-none"
                  onClick={() => handleSort(col.key as keyof Task)}
                >
                  {col.label}{" "}
                  {sortKey === col.key && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              ))}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-brand-text text-sm">
            {paginatedTasks.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                  No tasks found.
                </td>
              </tr>
            ) : (
              paginatedTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-t border-gray-200 dark:border-brand-border hover:bg-gray-50 dark:hover:bg-brand-bg transition"
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(task.id)}
                      onChange={() => toggleOne(task.id)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-xs">
                        {task.title[0]}
                      </div>
                      <Link
                        href={`/app/dashboard/projects/${projectId}/tasks/${task.id}`}
                        className="hover:underline"
                      >
                        {task.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-500 text-white capitalize">
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-200 text-gray-700">
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2">{task.dueDate || "—"}</td>
                  <td className="px-4 py-2">
                    {task.assignedTo?.name ? (
                      <span>{task.assignedTo.name}</span>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Paperclip size={14} />
                      {task.attachments ?? 0}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-brand-bg">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-brand-border">
        {paginatedTasks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No tasks found.</div>
        ) : (
          paginatedTasks.map((task) => (
            <div key={task.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(task.id)}
                    onChange={() => toggleOne(task.id)}
                  />
                  <Link
                    href={`/app/dashboard/projects/${projectId}/tasks/${task.id}`}
                  >
                    {task.title}
                  </Link>
                </div>
                <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-brand-bg">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Status:</span>
                <span className="capitalize">{task.status}</span>
                <span className="font-medium">Priority:</span>
                <span>{task.priority}</span>
                <span className="font-medium">Created:</span>
                <span>
                  {task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString()
                    : "—"}
                </span>
                <span className="font-medium">Due:</span>
                <span>{task.dueDate || "—"}</span>
                <span className="font-medium">Assigned:</span>
                <span>{task.assignedTo?.name || "Unassigned"}</span>
                <span className="font-medium">Attachments:</span>
                <span className="flex items-center gap-1">
                  <Paperclip size={12} /> {task.attachments ?? 0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-start sm:items-center justify-between p-3 border-t border-gray-200 dark:border-brand-border text-xs text-gray-500">
        <p>
          {selected.length} of {tasks.length} row(s) selected.
        </p>
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-brand-border disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPage((p) =>
                p * pageSize < processedTasks.length ? p + 1 : p
              )
            }
            disabled={page * pageSize >= processedTasks.length}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-brand-border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
