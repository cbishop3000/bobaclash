"use client"
import React, { useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Use AuthContext here
import { useModal } from '../context/ModalContext';
import AuthModal from './AuthModal';

const Logo = './clash.avif'; // Ensure this path to your logo is correct

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Order Online', href: 'https://order.rezku.com/Clash' },
  { name: 'Gift Card', href: '/giftcard' },
  { name: 'Socials', href: '/socials' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Subscriptions', href: '/subscribe' },
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
    await logout(); // Ensure the logout process completes from context
    window.location.reload(); // Refresh the page after logging out
  };

  return (
    <Disclosure as="nav" className="bg-stone-400">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Logo and Navigation Links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <img alt="Your Company" src={Logo} className="h-16 w-auto" />
              </Link>
            </div>
            <div className="m-2 pt-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-amber-900 font-semibold px-3 py-2 rounded-lg hover:bg-amber-100 transition duration-200"
                >
                  Dashboard
                </Link>
              )}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-stone-50 font-semibold px-3 py-2 rounded-lg hover:bg-amber-100 transition duration-200"
                >
                  {item.name}
                </Link>
              ))}
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
