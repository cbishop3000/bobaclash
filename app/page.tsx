"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // ✅ CORRECT!
import Coffee from "../public/coffee.jpg"; // Import the image for Parallax Section
import ParallaxSection from "@/app/components/ParallaxSection"; // Import the ParallaxSection component
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Map from './components/Map'

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // State to track if the component is mounted

  useEffect(() => {
    setIsMounted(true); // Set to true after component mounts
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMounted) return null; // Prevent rendering anything before mounting

  return (
    <main className="flex flex-col min-h-screen bg-gray-900 text-white">
      
      {/* Welcome Section */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {/* Parallax Background */}
        <div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/mainimg.avif")', // Image in the public folder
              transform: `translateY(${scrollY * 0.3}px)`, // This creates the parallax scroll effect
              height: '100%',
              width: '50%'
            }}
          >
            
          </div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`, // This creates the parallax scroll effect
              height: '100%',
              width: '50%'
            }}
          >
            
          </div>
        </div>
      
        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
          <div className="relative z-20 px-6 py-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Welcome to Clash Fam Coffee
            </h1>
            <p className="mt-4 text-lg md:text-xl m-2 text-gray-300">
              The best coffee, delivered straight to your door every month.
            </p>
          </div>
        </div>
      </section>
      <section>
        <Map />
      </section>
      {/* Parallax Section */}
    </main>
  );
}
