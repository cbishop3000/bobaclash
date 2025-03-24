"use client"; // Ensure the Navbar is client-side only

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // We use this hook for pathname
import { useState, useEffect } from 'react'; // Import useState and useEffect for login state management
import AuthModal from '../../pages/AuthModal'; // Adjust import if needed

const Logo = "./logo.png";  // Ensure this path to your logo is correct

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Subscriptions', href: '/subscribe' },
  { name: 'Projects', href: '/project' },
  { name: 'Calendar', href: '/calendar' },
];

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname(); // This is where you grab the current pathname
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status on component mount (You can replace this logic with your actual authentication logic)
    const token = localStorage.getItem('token'); // Example: check if token exists in local storage
    setIsLoggedIn(!!token); // If token exists, user is logged in
  }, []);

  const handleLogout = () => {
    // Clear the authentication token (or session cookie) to log the user out
    localStorage.removeItem('token'); 
    localStorage.removeItem('userId'); 
    setIsLoggedIn(false); // Update the login state
    // You can also redirect or refresh the page after logout if needed
  };

  return (
    <Disclosure as="nav" className="bg-amber-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <img alt="Your Company" src={Logo} className="h-8 w-auto" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Render AuthModal or Logout button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-full"
            >
              Logout
            </button>
          ) : (
            <AuthModal />
          )}
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined} // Compare pathname
              className={classNames(
                pathname === item.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
