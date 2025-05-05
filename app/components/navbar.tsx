'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext'; // Use AuthContext here
import AuthModal from './AuthModal';

const Logo = './logo.png'; // Ensure this path to your logo is correct

const navigation = [
  { name: 'Subscriptions', href: '/subscribe' },
  { name: 'Order', href: 'https://order.rezku.com/Clash' },
];

export default function Navbar() {
  const [modalMode, setModalMode] = useState<'login' | 'signup'>('login');
  const { isLoggedIn, isAdmin, logout } = useAuth(); // Access auth state from context
  const { openModal, closeModal, modalType } = useModal();

  // Open the login or signup modal
  const openAuthModal = (mode: 'login' | 'signup') => {
    setModalMode(mode);
    openModal(mode);
  };

  // Handle user logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Disclosure as="nav" className="bg-amber-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton>
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          
          {/* Logo and Navigation Links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <img alt="Your Company" src={Logo} className="h-8 w-auto" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {isAdmin && (
                  <Link href="/admin" className="text-gray-900">Dashboard</Link> // Only show if user is admin
                )}
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} className="text-gray-900">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="bg-amber-900 text-white px-3 py-2 rounded hover:bg-amber-700"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="bg-amber-900 text-white px-3 py-2 rounded hover:bg-amber-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel>
        {/* Mobile menu items */}
      </DisclosurePanel>

      {/* AuthModal */}
      <AuthModal defaultMode={modalMode} />
    </Disclosure>
  );
}
