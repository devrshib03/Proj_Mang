"use client";
import React from 'react';

type Task = {
	_id: string;
	title: string;
	status: string;
	priority: string;
	dueDate?: string;
	createdAt?: string;
	project?: { name: string } | null;
};

type Props = {
	tasks: Task[];
	sort: string; // field:dir
	onSortChange: (nextSort: string) => void;
	onComplete: (id: string) => void;
	onDelete: (id: string) => void;
	visible: {
		title: boolean;
		status: boolean;
		priority: boolean;
		createdAt: boolean;
		dueDate: boolean;
		project: boolean;
		attachments: boolean;
	};
};

const header = (
	label: string,
	field: string,
	activeSort: string,
	setSort: (s: string) => void
) => {
	const [af, dir] = activeSort.split(':');
	const isActive = af === field;
	const nextDir = isActive && dir === 'asc' ? 'desc' : 'asc';
	return (
		<button
			className="text-left font-semibold flex items-center gap-1"
			onClick={() => setSort(`${field}:${nextDir}`)}
		>
			{label}
			{isActive ? <span className="opacity-60">{dir === 'asc' ? '▲' : '▼'}</span> : null}
		</button>
	);
};

const MyTasksTable: React.FC<Props> = ({ tasks, sort, onSortChange, onComplete, onDelete, visible }) => {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full text-sm text-gray-800">
				<thead>
					<tr className="border-b border-gray-200 bg-white">
						{visible.title && <th className="p-2">{header('Task Title', 'title', sort, onSortChange)}</th>}
						{visible.status && <th className="p-2">{header('Status', 'status', sort, onSortChange)}</th>}
						{visible.priority && <th className="p-2">{header('Priority', 'priority', sort, onSortChange)}</th>}
						{visible.createdAt && <th className="p-2">{header('Created At', 'createdAt', sort, onSortChange)}</th>}
						{visible.dueDate && <th className="p-2">{header('Due Date', 'dueDate', sort, onSortChange)}</th>}
						{visible.project && <th className="p-2">Project</th>}
						{visible.attachments && <th className="p-2">Attachments</th>}
						<th className="p-2 text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{tasks.map((t) => {
						const statusClass =
							t.status === 'In Progress'
								? 'bg-amber-100 text-amber-700 border-amber-200'
							: t.status === 'Done'
								? 'bg-emerald-100 text-emerald-700 border-emerald-200'
							: t.status === 'Blocked'
								? 'bg-red-100 text-red-700 border-red-200'
							: 'bg-gray-100 text-gray-700 border-gray-200';
						const priorityClass =
							t.priority === 'High' || t.priority === 'Urgent'
								? 'bg-rose-100 text-rose-700 border-rose-200'
							: t.priority === 'Medium'
								? 'bg-gray-100 text-gray-700 border-gray-200'
							: 'bg-emerald-100 text-emerald-700 border-emerald-200';
						return (
							<tr key={t._id} className="border-b border-gray-200 hover:bg-gray-50">
								{visible.title && <td className="p-2 font-medium">{t.title}</td>}
								{visible.status && (
									<td className="p-2">
										<span className={`px-2 py-0.5 rounded text-xs border ${statusClass}`}>{t.status}</span>
									</td>
								)}
								{visible.priority && (
									<td className="p-2">
										<span className={`px-2 py-0.5 rounded text-xs border ${priorityClass}`}>{t.priority}</span>
									</td>
								)}
								{visible.createdAt && <td className="p-2">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}</td>}
								{visible.dueDate && <td className="p-2">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>}
								{visible.project && <td className="p-2">{t.project?.name || '-'}</td>}
								{visible.attachments && <td className="p-2">{'attachmentsCount' in t ? (t as any).attachmentsCount ?? 0 : 0}</td>}
								<td className="p-2 text-right">
									<div className="flex justify-end gap-2">
										<button onClick={() => onComplete(t._id)} className="px-2 py-1 border rounded bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50">Complete</button>
										<button onClick={() => onDelete(t._id)} className="px-2 py-1 border rounded bg-white text-rose-700 border-rose-200 hover:bg-rose-50">Delete</button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default MyTasksTable;


