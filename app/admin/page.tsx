'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [itemsShipped, setItemsShipped] = useState('');

  const [openUserDeliveries, setOpenUserDeliveries] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    } else if (user?.role !== 'ADMIN') {
      router.push('/');
    } else {
      setIsChecking(false);
    }
  }, [isLoggedIn, user, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      const fetchUsers = async () => {
        try {
          const response = await fetch('/api/get-subs');
          const data = await response.json();
          setUsers(data);
          setLoadingUsers(false);
        } catch (error) {
          console.error('Error fetching users:', error);
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    }
  }, [user?.role]);

  const filteredUsers = users.filter((user) => {
    const lower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(lower) ||
      user.role.toLowerCase().includes(lower) ||
      (user.stripeCustomerId && user.stripeCustomerId.toLowerCase().includes(lower)) ||
      (user.subscriptionTier && user.subscriptionTier.toLowerCase().includes(lower)) ||
      (user.address && user.address.toLowerCase().includes(lower))
    );
  });

  const handleFilled = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveDelivery = async () => {
    if (!itemsShipped) {
      alert('Please provide a description of the items shipped.');
      return;
    }

    const deliveryData = {
      userId: selectedUser.id,
      items: itemsShipped,
      shippedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/save-delivery', {
        method: 'POST',
        body: JSON.stringify(deliveryData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Delivery log saved successfully');
        setIsModalOpen(false);
      } else {
        alert('Failed to save delivery log');
      }
    } catch (error) {
      console.error('Error saving delivery log:', error);
      alert('Error saving delivery log');
    }
  };

  const toggleDeliveryLogs = (userId: string) => {
    setOpenUserDeliveries((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  if (isChecking) {
    return <div className="p-4 text-gray-500">Checking admin access...</div>;
  }

  if (loadingUsers) {
    return <div className="p-4 text-gray-500">Loading users...</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Legend */}
      <div className="mb-4 text-sm text-gray-600">
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span> Delivery in last 30 days
        <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-4 mr-1"></span> No recent delivery
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600">Assign roles and manage deliveries.</p>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="h-[400px] overflow-y-auto">
            <ul>
              {filteredUsers.length === 0 ? (
                <li className="p-4 text-gray-500">No users found</li>
              ) : (
                filteredUsers.map((user) => {
                  const now = new Date();
                  const oneMonthAgo = new Date();
                  oneMonthAgo.setDate(now.getDate() - 30);

                  const lastDelivery = user.deliveries?.length
                    ? new Date(user.deliveries[user.deliveries.length - 1].shippedAt)
                    : null;

                  const hasRecentDelivery = lastDelivery && lastDelivery > oneMonthAgo;

                  const daysSinceDelivery = lastDelivery
                    ? Math.floor((now.getTime() - lastDelivery.getTime()) / (1000 * 60 * 60 * 24))
                    : null;

                  const userCardClass = `mb-6 border-l-4 pb-4 pl-4 rounded ${
                    hasRecentDelivery ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`;

                  return (
                    <li key={user.id} className={userCardClass}>
                      <h3 className="font-bold text-lg">{user.email}</h3>
                      <p><strong>Role:</strong> {user.role}</p>
                      {user.stripeCustomerId && <p><strong>Stripe Customer ID:</strong> {user.stripeCustomerId}</p>}
                      {user.subscriptionTier && <p><strong>Subscription Tier:</strong> {user.subscriptionTier}</p>}
                      <p><strong>New Subscriber:</strong> {user.isNewSubscriber ? 'Yes' : 'No'}</p>
                      <p><strong>Merch Sent:</strong> {user.merchSent ? 'Yes' : 'No'}</p>
                      {user.address && <p><strong>Address:</strong> {user.address}</p>}
                      <p><strong>Deliveries:</strong> {user.deliveries?.length || 0}</p>
                      <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                      <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                      {lastDelivery && (
                        <p><strong>Last Delivery:</strong> {daysSinceDelivery} days ago</p>
                      )}

                      <button
                        className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => toggleDeliveryLogs(user.id)}
                      >
                        {openUserDeliveries[user.id] ? 'Hide Deliveries' : 'Show Deliveries'}
                      </button>

                      {openUserDeliveries[user.id] && user.deliveries && (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold">Delivery Logs</h4>
                          <ul>
                            {user.deliveries.map((delivery: any) => (
                              <li key={delivery.id} className="mb-4 p-4 border-b">
                                <p><strong>Shipped At:</strong> {new Date(delivery.shippedAt).toLocaleString()}</p>
                                <p><strong>Items:</strong> {delivery.items}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleFilled(user.id)}
                      >
                        Filled
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </section>
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Enter Delivery Details</h2>
            <p><strong>User:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>

            <div className="mb-4">
              <label className="block text-gray-600" htmlFor="itemsShipped">Items Shipped</label>
              <textarea
                id="itemsShipped"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
                value={itemsShipped}
                onChange={(e) => setItemsShipped(e.target.value)}
                placeholder="Describe the items shipped..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSaveDelivery}
              >
                Save Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
