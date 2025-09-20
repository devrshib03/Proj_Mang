"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { fetchTasks, updateTask, deleteTask } from './data';
import Input from '../../../components/Input';
import MyTasksTable from '../../../components/MyTasksTable';

const PlaceholderIcon = (props: any) => <span {...props}>🔎</span>;

const MyTasksPage = () => {
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [tasks, setTasks] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sort, setSort] = useState('createdAt:desc');
	const [visible, setVisible] = useState({
		title: true,
		status: true,
		priority: true,
		createdAt: true,
		dueDate: true,
		project: true,
		attachments: true,
	});
	const [debouncedQuery, setDebouncedQuery] = useState('');

	useEffect(() => {
		const t = setTimeout(() => setDebouncedQuery(query), 300);
		return () => clearTimeout(t);
	}, [query]);

	useEffect(() => {
		let active = true;
		setLoading(true);
		setError(null);
		fetchTasks({ page, q: debouncedQuery, sort })
			.then((res) => {
				if (!active) return;
				setTasks(res.data || []);
				setTotal(res.total || 0);
			})
			.catch((e) => active && setError(e.message || 'Failed to load'))
			.finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, [page, debouncedQuery, sort]);

	async function handleComplete(id: string) {
		const prev = tasks;
		setTasks((t) => t.map((x) => (x._id === id ? { ...x, status: 'Done' } : x)));
		try {
			await updateTask(id, { status: 'Done' });
		} catch (_e) {
			setTasks(prev);
		}
	}

	async function handleDelete(id: string) {
		const prev = tasks;
		setTasks((t) => t.filter((x) => x._id !== id));
		try {
			await deleteTask(id);
			setTotal((n) => Math.max(0, n - 1));
		} catch (_e) {
			setTasks(prev);
		}
	}

	return (
		<div className="p-4">
			<div className="mb-4 flex items-center justify-between gap-4">
				<div className="max-w-md flex-1">
					<Input icon={PlaceholderIcon} placeholder="Filter task title..." value={query} onChange={(e: any) => setQuery(e.target.value)} />
				</div>
				<div>
					<div className="relative inline-block text-left">
						<details className="group">
							<summary className="list-none select-none px-3 py-2 rounded border bg-zinc-800 text-white cursor-pointer">Columns ▾</summary>
							<div className="absolute right-0 mt-2 w-56 rounded-md border bg-zinc-900 p-2 shadow-lg text-white">
								{Object.keys(visible).map((k) => (
									<label key={k} className="flex items-center gap-2 px-2 py-1 text-sm text-white">
										<input type="checkbox" checked={(visible as any)[k]} onChange={(e) => setVisible((v) => ({ ...v, [k]: e.target.checked }))} />
										<span className="capitalize">{k}</span>
									</label>
								))}
							</div>
						</details>
					</div>
				</div>
			</div>
			{loading && <div>Loading tasks...</div>}
			{error && <div className="text-red-500">{error}</div>}
			{!loading && !error && (
				<div>
					<MyTasksTable tasks={tasks} sort={sort} onSortChange={setSort} onComplete={handleComplete} onDelete={handleDelete} visible={visible} />
					<div className="mt-4 flex items-center gap-2">
						<button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 rounded border border-gray-300 bg-white text-black hover:bg-gray-50 disabled:opacity-50">Previous</button>
						<button disabled={page * 10 >= total} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 rounded border border-gray-300 bg-white text-black hover:bg-gray-50 disabled:opacity-50">Next</button>
						<span className="text-sm opacity-70">{total} total</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyTasksPage;