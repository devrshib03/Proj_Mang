'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getAllUsers, saveAllUsers, AppUser } from '../../lib/localAuth';

export default function AdminPage() {
  const router = useRouter();
  const [me, setMe] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    const curr = getCurrentUser();
    if (!curr) {
      router.push('/login');
      return;
    }
    if (curr.role !== 'Admin') {
      router.push('/user-profile'); // non-admins redirected
      return;
    }
    setMe(curr);
    setUsers(getAllUsers());
  }, [router]);

  if (!me) return null;

  const onRoleChange = (id: string, role: string) => {
    const updated = users.map((u) => (u.id === id ? { ...u, role } : u));
    setUsers(updated);
    saveAllUsers(updated);

    // if admin changed their own role, reflect immediately and redirect if demoted
    if (id === me.id && role !== 'Admin') {
      localStorage.setItem('user', JSON.stringify({ ...me, role }));
      alert('You changed your own role — you will be redirected to profile.');
      router.push('/user-profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin — Manage Roles</h1>

        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>

              <select value={u.role} onChange={(e) => onRoleChange(u.id, e.target.value)}
                className="px-3 py-1 border rounded-md">
                <option value="Team Member">Team Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}