// // src/components/ProjectForm.tsx
// "use client";

// import { useState } from "react";

// export default function ProjectForm() {
//   const [projectName, setProjectName] = useState("");
//   const [description, setDescription] = useState("");
//   const [taskName, setTaskName] = useState("");
//   const [taskStatus, setTaskStatus] = useState("in-progress");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newProject = {
//       id: Date.now(),
//       name: projectName,
//       description,
//       date: new Date().toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       }),
//     };

//     const newTask = {
//       id: Date.now(),
//       name: taskName,
//       status: taskStatus,
//       projectId: newProject.id,
//     };

//     const newActivity = {
//       id: Date.now(),
//       text: `Created project "${newProject.name}" with task "${newTask.name}"`,
//       time: "just now",
//     };

//     // Update localStorage
//     const projects = JSON.parse(localStorage.getItem("projects") || "[]");
//     const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
//     const activities = JSON.parse(localStorage.getItem("activities") || "[]");

//     localStorage.setItem("projects", JSON.stringify([...projects, newProject]));
//     localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
//     localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]));

//     // Reset form
//     setProjectName("");
//     setDescription("");
//     setTaskName("");
//     setTaskStatus("in-progress");

//     alert("✅ Project & Task added to localStorage!");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-bg transition-colors">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-brand-card p-6 rounded-2xl shadow-md w-full max-w-md space-y-4 border border-gray-200 dark:border-brand-border"
//       >
//         <h2 className="text-xl font-bold text-gray-900 dark:text-brand-text">Create Project</h2>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">
//             Project Name
//           </label>
//           <input
//             type="text"
//             value={projectName}
//             onChange={(e) => setProjectName(e.target.value)}
//             required
//             className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-brand-bg dark:border-brand-border dark:text-brand-text"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">
//             Description
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-brand-bg dark:border-brand-border dark:text-brand-text"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">
//             Task Name
//           </label>
//           <input
//             type="text"
//             value={taskName}
//             onChange={(e) => setTaskName(e.target.value)}
//             required
//             className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-brand-bg dark:border-brand-border dark:text-brand-text"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-brand-text/70">
//             Task Status
//           </label>
//           <select
//             value={taskStatus}
//             onChange={(e) => setTaskStatus(e.target.value)}
//             className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-brand-bg dark:border-brand-border dark:text-brand-text"
//           >
//             <option value="in-progress">In Progress</option>
//             <option value="completed">Completed</option>
//             <option value="overdue">Overdue</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition"
//         >
//           Save
//         </button>
//       </form>
//     </div>
//   );
// }
