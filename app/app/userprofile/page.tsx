'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getAllUsers, saveAllUsers, saveCurrentUser, AppUser } from '../../../lib/localAuth';

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push('/login');
      return;
    }
    setUser(u);
    setName(u.name);
    setEmail(u.email);
  }, [router]);

  if (!user) return null;

  const onSave = () => {
    const updated: AppUser = { ...user, name, email };
    // update current
    saveCurrentUser(updated);
    // update in users list
    const users = getAllUsers();
    const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
    saveAllUsers(updatedUsers);
    setUser(updated);
    setEditing(false);
    alert('Profile updated');
  };

  const onLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Your profile</h1>

        <label className="block text-sm font-medium">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-lg" disabled={!editing} />

        <label className="block text-sm font-medium">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-lg" disabled={!editing} />

        <label className="block text-sm font-medium">Role</label>
        <input value={user.role} disabled
          className="w-full mb-4 px-3 py-2 border rounded-lg bg-gray-50 text-gray-700" />

        <div className="flex gap-2">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex-1 py-2 bg-emerald-500 text-white rounded-lg">Edit</button>
          ) : (
            <button onClick={onSave} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg">Save</button>
          )}
          <button onClick={onLogout} className="flex-1 py-2 bg-gray-500 text-white rounded-lg">Logout</button>
        </div>
      </div>
    </div>
  );
}
