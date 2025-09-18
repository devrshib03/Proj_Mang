export type TaskListParams = {
	page?: number;
	limit?: number;
	q?: string;
	status?: string;
	priority?: string;
	sort?: string; // field:dir
};

export async function fetchTasks(params: TaskListParams = {}) {
	const sp = new URLSearchParams();
	if (params.page) sp.set('page', String(params.page));
	if (params.limit) sp.set('limit', String(params.limit));
	if (params.q) sp.set('q', params.q);
	if (params.status) sp.set('status', params.status);
	if (params.priority) sp.set('priority', params.priority);
	if (params.sort) sp.set('sort', params.sort);

	const res = await fetch(`/api/tasks?${sp.toString()}`, { cache: 'no-store', credentials: 'include' });
	if (!res.ok) {
		let message = `Failed to fetch tasks (HTTP ${res.status})`;
		try {
			const body = await res.json();
			if (body?.message) message = body.message;
		} catch {}
		throw new Error(message);
	}
	return res.json();
}

export async function createTask(payload: any) {
	const res = await fetch('/api/tasks', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Failed to create task');
	return res.json();
}

export async function updateTask(id: string, payload: any) {
	const res = await fetch(`/api/tasks/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Failed to update task');
	return res.json();
}

export async function deleteTask(id: string) {
	const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE', credentials: 'include' });
	if (!res.ok) throw new Error('Failed to delete task');
	return res.json();
}


