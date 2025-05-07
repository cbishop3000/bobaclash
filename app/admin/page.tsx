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

    const fetchSubscribedUsers = async () => {
      try {
        const response = await fetch('/api/get-subscriptions');
        const data = await response.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Error: Received data is not an array');
        }
      } catch (error) {
        console.error('Error fetching subscribed users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchSubscribedUsers();
  }, [isLoggedIn, user, router]);

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
      shippedAt: new Date().toISOString(), // This returns a string
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

  const checkIfNewMonthApproaching = (subscriptionDate: string) => {
    const now = new Date();
    const subscriptionDateObj = new Date(subscriptionDate);
    const nextMonth = new Date(subscriptionDateObj);
    nextMonth.setMonth(subscriptionDateObj.getMonth() + 1);

    const diffTime = nextMonth.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 7 && diffDays > 0; // Within a week of the next subscription month
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

      <div className="grid grid-cols-1">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredUsers.length === 0 ? (
                  <li className="p-4 text-gray-500">No users found</li>
                ) : (
                  filteredUsers.map((user) => {
                    const now = new Date();
                    const lastDelivery = user.deliveries?.length
                      ? new Date(user.deliveries[user.deliveries.length - 1].shippedAt)
                      : null;

                    const isNewMonthApproaching =
                      lastDelivery && checkIfNewMonthApproaching(lastDelivery.toISOString()); // Convert to string

                    const hasRecentDelivery = user.deliveries?.length > 0;

                    const userCardClass = `border-l-4 pb-4 pl-4 rounded ${
                      hasRecentDelivery
                        ? 'border-green-500 bg-green-50'
                        : isNewMonthApproaching
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-red-500 bg-red-50'
                    }`;

                    return (
                      <div key={user.id} className={userCardClass}>
                        <h3 className="font-bold text-lg truncate">{user.email}</h3>
                        <p className="text-sm"><strong>Role:</strong> {user.role}</p>
                        {user.stripeCustomerId && <p className="text-sm"><strong>Stripe ID:</strong> {user.stripeCustomerId}</p>}
                        {user.subscriptionTier && <p className="text-sm"><strong>Tier:</strong> {user.subscriptionTier}</p>}
                        <p className="text-sm"><strong>New:</strong> {user.isNewSubscriber ? 'Yes' : 'No'}</p>
                        <p className="text-sm"><strong>Merch:</strong> {user.merchSent ? 'Yes' : 'No'}</p>
                        {user.address && <p className="text-sm"><strong>Address:</strong> {user.address}</p>}
                        <p className="text-sm"><strong>Deliveries:</strong> {user.deliveries?.length || 0}</p>

                        {/* Timestamps */}
                        <p className="text-xs text-gray-500">Created: {new Date(user.createdAt).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Updated: {new Date(user.updatedAt).toLocaleString()}</p>

                        {/* Filled Button */}
                        <button
                          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                          onClick={() => handleFilled(user.id)}
                        >
                          Filled
                        </button>

                        {/* Delivery Log Button */}
                        <button
                          className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                          onClick={() => toggleDeliveryLogs(user.id)}
                        >
                          {openUserDeliveries[user.id] ? 'Hide Deliveries' : 'Show Deliveries'}
                        </button>

                        {/* Show Deliveries if toggled */}
                        {openUserDeliveries[user.id] && user.deliveries && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold">Delivery Logs</h4>
                            <ul>
                              {user.deliveries.map((delivery: any) => (
                                <li key={delivery.id} className="mb-4 p-4 border-b text-xs">
                                  <p><strong>Shipped At:</strong> {new Date(delivery.shippedAt).toLocaleString()}</p>
                                  <p><strong>Items:</strong> {delivery.items}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </ul>
          </div>
        </section>
      </div>

      {/* Modal for shipping items */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Log Delivery for {selectedUser.email}</h3>
            <textarea
              rows={5}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter items shipped..."
              value={itemsShipped}
              onChange={(e) => setItemsShipped(e.target.value)}
            />
            <div className="mt-4">
              <button
                className="mr-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSaveDelivery}
              >
                Save Delivery Log
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
