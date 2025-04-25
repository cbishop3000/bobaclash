"use client"
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react'; // For managing the modal
import { useModal } from '../context/ModalContext';
import AuthModal from '@/pages/AuthModal';

const Logo = "./logo.png";  // Ensure this path to your logo is correct

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Subscriptions', href: '/subscribe' },
  { name: 'Order', href: '/order' },
];

export default function Navbar() {
  const { openModal } = useModal(); // Accessing modal functions

  return (
    <Disclosure as="nav" className="bg-amber-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton>
              <span className="sr-only">Open main menu</span>
              {/* Menu Icon */}
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
      <div onClick={openModal} className="ml-4 bg-amber-900 text-white px-3 py-2 rounded hover:bg-amber-700">
        <AuthModal />
      </div>
        </div>
      </div>

      <DisclosurePanel>
        {/* Mobile menu items */}
      </DisclosurePanel>
    </Disclosure>
  );
}
