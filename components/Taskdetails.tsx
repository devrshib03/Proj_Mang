"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import { Task, Comment, Project } from "../types";
import "react-quill/dist/quill.snow.css";
import "styles/quill-custom.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function TaskDetails({ task }: { task: Task }) {
  const [docContent, setDocContent] = useState<string>(task?.documentation ?? "");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [project, setProject] = useState<Project | null>(null);

  // 🔹 Quill toolbar
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: [1, 2, 3, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  // 🔹 Load project info
  useEffect(() => {
    if (!task?.projectId) return;
    fetch(`/api/projects/${task.projectId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((proj) => setProject(proj))
      .catch(() => setProject(null));
  }, [task?.projectId]);

  // 🔹 Load comments
  useEffect(() => {
    if (!task?.id) return;
    fetch(`/api/tasks/${task.id}/comments`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setComments(data ?? []))
      .catch(() => setComments([]));
  }, [task?.id]);

  // 🔹 Save documentation
  const saveDocumentation = async (content: string) => {
    setDocContent(content);
    if (!task?.id) return;
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ documentation: content }),
    });
  };

  // 🔹 Add comment
  const addComment = async () => {
    if (!task?.id || !newComment.trim()) return;

    const res = await fetch(`/api/tasks/${task.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        text: newComment,
        author: "You", // 🔹 Replace with logged-in user later
      }),
    });

    if (res.ok) {
      const comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  if (!task) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠️ Task not found or invalid
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold break-words">
                    {task.title ?? "Untitled Task"}
                  </h2>
                  {project ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Project: <span className="font-medium">{project.name}</span>{" "}
                      — {project.description || "No description"}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No Project Linked
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm">
                      {task.assignedTo?.initials ?? "NA"}
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      {task.assignedTo?.name ?? "Unassigned"}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1 border rounded-md text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Pencil className="w-4 h-4" />
                    Edit Task
                  </button>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 break-words">
                  {task.description || "No description provided"}
                </p>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-1">Status</h3>
                  <span className="px-3 py-1 text-xs rounded bg-yellow-500 text-white">
                    {task.status ?? "Unknown"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Due Date</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {task.dueDate ?? "—"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Priority</h3>
                  <span className="px-3 py-1 text-xs rounded bg-orange-500 text-white">
                    {task.priority ?? "Normal"}
                  </span>
                </div>
              </div>
            </div>

            {/* Documentation */}
            <div className="quill-wrapper bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold mb-3">Documentation</h3>
              <ReactQuill
                value={docContent}
                onChange={saveDocumentation}
                modules={modules}
                theme="snow"
                placeholder="Write documentation notes here..."
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Comments */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold mb-3">Comments</h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full h-24 px-3 py-2 border rounded-md resize-none 
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                  focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                className={`mt-2 w-full sm:w-auto px-4 py-2 rounded-md text-white text-sm sm:text-base 
                  ${
                    newComment.trim()
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                Post Comment
              </button>

              {/* Render comments */}
              <div className="mt-4 space-y-3">
                {comments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="border-b pb-2">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-semibold">{c.author}:</span>{" "}
                        {c.text}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold mb-3">Attachments</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No attachments found
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
