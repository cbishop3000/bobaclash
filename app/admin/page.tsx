'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

// Types
interface DeliveryLog {
  id: string;
  userId: string;
  shippedAt: string;
  items: string;
}

interface SubscriptionUser {
  id: string;
  email: string;
  role: string;
  stripeCustomerId?: string;
  subscriptionTier?: string;
  isNewSubscriber: boolean;
  merchSent: boolean;
  addressFormatted?: string;
  createdAt: string;
  updatedAt: string;
  deliveries: DeliveryLog[];
}

interface DeliveryFormData {
  userId: string;
  items: string;
  shippedAt: string;
}

// Constants
const RECENT_DELIVERY_DAYS = 30;
const UPCOMING_DELIVERY_WARNING_DAYS = 5; // Yellow warning within 5 days
const DELIVERY_CYCLE_DAYS = 30; // Assume monthly deliveries

export default function AdminDashboard() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [users, setUsers] = useState<SubscriptionUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SubscriptionUser | null>(null);
  const [itemsShipped, setItemsShipped] = useState('');
  const [openUserDeliveries, setOpenUserDeliveries] = useState<Record<string, boolean>>({});
  const [savingDelivery, setSavingDelivery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication and data fetching
  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchSubscribedUsers();
  }, [isLoggedIn, user, router, authLoading]);

  const fetchSubscribedUsers = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/get-subscriptions');

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Memoized filtered users for performance
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const lower = searchTerm.toLowerCase();
    return users.filter((user) => (
      user.email.toLowerCase().includes(lower) ||
      user.role.toLowerCase().includes(lower) ||
      (user.stripeCustomerId && user.stripeCustomerId.toLowerCase().includes(lower)) ||
      (user.subscriptionTier && user.subscriptionTier.toLowerCase().includes(lower)) ||
      (user.addressFormatted && user.addressFormatted.toLowerCase().includes(lower))
    ));
  }, [users, searchTerm]);

  // Utility functions for delivery status
  const getDeliveryStatus = useCallback((user: SubscriptionUser): 'none' | 'upcoming' | 'overdue' | 'recent' => {
    if (!user.deliveries?.length) return 'none';

    const lastDelivery = new Date(user.deliveries[user.deliveries.length - 1].shippedAt);
    const nextDeliveryDue = new Date(lastDelivery);
    nextDeliveryDue.setDate(lastDelivery.getDate() + DELIVERY_CYCLE_DAYS);

    const now = new Date();
    const daysUntilDue = Math.ceil((nextDeliveryDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceLastDelivery = Math.floor((now.getTime() - lastDelivery.getTime()) / (1000 * 60 * 60 * 24));

    // If last delivery was recent (within 30 days), consider it recent
    if (daysSinceLastDelivery <= RECENT_DELIVERY_DAYS) {
      return 'recent';
    }

    // If next delivery is due within warning period, mark as upcoming
    if (daysUntilDue <= UPCOMING_DELIVERY_WARNING_DAYS && daysUntilDue > 0) {
      return 'upcoming';
    }

    // If next delivery is overdue (past due date), mark as overdue
    if (daysUntilDue <= 0) {
      return 'overdue';
    }

    // Default to recent if we have deliveries but don't fit other categories
    return 'recent';
  }, []);



  // Event handlers
  const handleFilled = useCallback((userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
      setItemsShipped(''); // Reset form
    }
  }, [users]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setItemsShipped('');
  }, []);

  const handleSaveDelivery = useCallback(async () => {
    if (!selectedUser) return;

    if (!itemsShipped.trim()) {
      toast.error('Please provide a description of the items shipped.');
      return;
    }

    const deliveryData: DeliveryFormData = {
      userId: selectedUser.id,
      items: itemsShipped.trim(),
      shippedAt: new Date().toISOString(),
    };

    setSavingDelivery(true);

    try {
      const response = await fetch('/api/save-delivery', {
        method: 'POST',
        body: JSON.stringify(deliveryData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to save delivery: ${response.statusText}`);
      }

      // Optimistically update the UI
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                deliveries: [
                  ...user.deliveries,
                  {
                    id: `temp-${Date.now()}`, // Temporary ID
                    userId: selectedUser.id,
                    shippedAt: deliveryData.shippedAt,
                    items: deliveryData.items,
                  }
                ]
              }
            : user
        )
      );

      toast.success('Delivery logged successfully!');
      handleCloseModal();

      // Refresh data to get the real ID from server
      fetchSubscribedUsers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save delivery log';
      toast.error(errorMessage);
    } finally {
      setSavingDelivery(false);
    }
  }, [selectedUser, itemsShipped, handleCloseModal, fetchSubscribedUsers]);

  const toggleDeliveryLogs = useCallback((userId: string) => {
    setOpenUserDeliveries((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  }, []);

  // Statistics - moved before conditional returns to follow Rules of Hooks
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const usersWithRecentDeliveries = users.filter(user => getDeliveryStatus(user) === 'recent').length;
    const usersDueForDelivery = users.filter(user => getDeliveryStatus(user) === 'upcoming').length;
    const usersOverdue = users.filter(user => getDeliveryStatus(user) === 'overdue').length;
    const usersWithNoDeliveries = users.filter(user => getDeliveryStatus(user) === 'none').length;
    const totalDeliveries = users.reduce((sum, user) => sum + (user.deliveries?.length || 0), 0);

    return {
      totalUsers,
      usersWithRecentDeliveries,
      usersDueForDelivery,
      usersOverdue,
      usersWithNoDeliveries,
      totalDeliveries,
    };
  }, [users, getDeliveryStatus]);

  // Loading states
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  if (loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchSubscribedUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage subscriber accounts and track deliveries</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
          <div className="text-sm text-gray-600">Total Subscribers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{stats.usersWithRecentDeliveries}</div>
          <div className="text-sm text-gray-600">Recent Deliveries</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-yellow-600">{stats.usersDueForDelivery}</div>
          <div className="text-sm text-gray-600">Due Soon</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">{stats.usersOverdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-600">{stats.usersWithNoDeliveries}</div>
          <div className="text-sm text-gray-600">No Deliveries</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalDeliveries}</div>
          <div className="text-sm text-gray-600">Total Deliveries</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Status Legend:</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Recent delivery (last {RECENT_DELIVERY_DAYS} days)
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            Delivery due soon (within {UPCOMING_DELIVERY_WARNING_DAYS} days)
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Delivery overdue
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
            No deliveries yet
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <section className="bg-white shadow rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Subscriber Management</h2>
              <p className="text-gray-600">Manage deliveries and track subscriber status</p>
            </div>
            <button
              onClick={fetchSubscribedUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={loadingUsers}
            >
              {loadingUsers ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by email, role, tier, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {searchTerm && (
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} subscribers
              </div>
            )}
          </div>

          <div className="h-[400px] overflow-y-auto">
            <ul>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredUsers.length === 0 ? (
                  <li className="p-4 text-gray-500">
                    {searchTerm ? `No users found matching "${searchTerm}"` : 'No subscribed users found'}
                  </li>
                ) : (
                  filteredUsers.map((user) => {
                    const deliveryStatus = getDeliveryStatus(user);

                    const getCardStyling = (status: string) => {
                      switch (status) {
                        case 'recent':
                          return 'border-green-500 bg-green-50';
                        case 'upcoming':
                          return 'border-yellow-500 bg-yellow-50';
                        case 'overdue':
                          return 'border-red-500 bg-red-50';
                        case 'none':
                        default:
                          return 'border-gray-400 bg-gray-50';
                      }
                    };

                    const userCardClass = `border-l-4 pb-4 pl-4 rounded transition-colors ${getCardStyling(deliveryStatus)}`;

                    const getStatusText = (status: string) => {
                      switch (status) {
                        case 'recent':
                          return 'Recent delivery';
                        case 'upcoming':
                          return 'Delivery due soon';
                        case 'overdue':
                          return 'Delivery overdue';
                        case 'none':
                        default:
                          return 'No deliveries yet';
                      }
                    };

                    return (
                      <div key={user.id} className={userCardClass}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg truncate" title={user.email}>
                            {user.email}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            deliveryStatus === 'recent' ? 'bg-green-100 text-green-800' :
                            deliveryStatus === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                            deliveryStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getStatusText(deliveryStatus)}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><strong>Role:</strong> {user.role}</p>
                          {user.stripeCustomerId && (
                            <p><strong>Stripe ID:</strong> {user.stripeCustomerId}</p>
                          )}
                          {user.subscriptionTier && (
                            <p><strong>Tier:</strong> {user.subscriptionTier}</p>
                          )}
                          <p><strong>New:</strong> {user.isNewSubscriber ? 'Yes' : 'No'}</p>
                          <p><strong>Merch:</strong> {user.merchSent ? 'Yes' : 'No'}</p>
                          {user.addressFormatted && (
                            <p><strong>Address:</strong> {user.addressFormatted}</p>
                          )}
                          <p><strong>Deliveries:</strong> {user.deliveries?.length || 0}</p>
                        </div>

                        {/* Timestamps */}
                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                          <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
                          <p>Updated: {new Date(user.updatedAt).toLocaleString()}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-3 space-x-2">
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs transition-colors"
                            onClick={() => handleFilled(user.id)}
                          >
                            Log Delivery
                          </button>

                          <button
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs transition-colors"
                            onClick={() => toggleDeliveryLogs(user.id)}
                          >
                            {openUserDeliveries[user.id] ? 'Hide' : 'Show'} Deliveries
                          </button>
                        </div>

                        {/* Delivery Logs */}
                        {openUserDeliveries[user.id] && user.deliveries?.length > 0 && (
                          <div className="mt-4 border-t pt-3">
                            <h4 className="text-sm font-semibold mb-2">Delivery History</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {user.deliveries
                                .sort((a, b) => new Date(b.shippedAt).getTime() - new Date(a.shippedAt).getTime())
                                .map((delivery) => (
                                <div key={delivery.id} className="p-2 bg-gray-50 rounded text-xs">
                                  <p><strong>Shipped:</strong> {new Date(delivery.shippedAt).toLocaleString()}</p>
                                  <p><strong>Items:</strong> {delivery.items}</p>
                                </div>
                              ))}
                            </div>
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

      {/* Enhanced Modal for logging deliveries */}
      {isModalOpen && selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Log Delivery</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-xl"
                disabled={savingDelivery}
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Customer:</p>
              <p className="font-medium">{selectedUser.email}</p>
              {selectedUser.subscriptionTier && (
                <p className="text-sm text-gray-600">Tier: {selectedUser.subscriptionTier}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="items-shipped" className="block text-sm font-medium text-gray-700 mb-2">
                Items Shipped *
              </label>
              <textarea
                id="items-shipped"
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter detailed description of items shipped..."
                value={itemsShipped}
                onChange={(e) => setItemsShipped(e.target.value)}
                disabled={savingDelivery}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                onClick={handleCloseModal}
                disabled={savingDelivery}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={handleSaveDelivery}
                disabled={savingDelivery || !itemsShipped.trim()}
              >
                {savingDelivery ? 'Saving...' : 'Save Delivery Log'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
