'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // adjust path as needed

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'ADMIN') {
      router.push('/'); // redirect non-admins or not logged in
    }
  }, [isLoggedIn, user, router]);

  // While checking auth status, avoid flashing dashboard
  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return <div className="p-4 text-gray-500">Checking admin access...</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example dashboard panels */}
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Subscriptions</h2>
          <p className="text-gray-600">View and manage all customer subscriptions.</p>
        </section>

        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-gray-600">Track and update recent orders from customers.</p>
        </section>
        
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600">Assign roles and ban users if needed.</p>
        </section>
      </div>
    </main>
  );
}
