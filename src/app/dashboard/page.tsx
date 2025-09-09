'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If not logged in, redirect to login page
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    // Show a loading state or nothing while redirecting
    return <div className="text-center text-white">Redirecting to login...</div>;
  }

  return (
    <div className="text-white p-8">
      <h1 className="text-4xl font-bold">Welcome to the Dashboard, {user.name}!</h1>
      <p className="mt-4">This is your secure dashboard.</p>
    </div>
  );
}