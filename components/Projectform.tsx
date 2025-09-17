"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  comments: { id: string; text: string; author: string; createdAt: string }[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  route: string;
  tasks: Task[]; // each project has its own tasks
}

interface ProjectFormProps {
  onProjectCreated?: (project: Project) => void;
}

export default function ProjectForm({ onProjectCreated }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject: Project = {
      id: uuidv4(),
      name: formData.name,
      description: formData.description,
      route: `/projects/${formData.name.toLowerCase().replace(/\s+/g, "-")}`,
      tasks: [], // 👈 start with empty tasks
    };

    const savedProjects = localStorage.getItem("projects");
    const projects = savedProjects ? JSON.parse(savedProjects) : [];
    const updated = [...projects, newProject];
    localStorage.setItem("projects", JSON.stringify(updated));

    if (onProjectCreated) {
      onProjectCreated(newProject);
    }

    setFormData({ name: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Project Name"
        required
        className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Project Description"
        className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white"
      />

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Create Project
      </button>
    </form>
  );
}
