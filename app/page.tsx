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
      <section className="relative w-full overflow-hidden bg-black">
  {/* Welcome Section - This will take up the full screen height first */}
  <div className="relative h-screen flex flex-col items-center justify-center text-center">
    <div className="relative z-20 px-6 py-8">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
        Welcome to Clash Fam Coffee
      </h1>
      <p className="mt-4 text-lg md:text-xl m-2 text-gray-300">
        The best coffee, delivered straight to your door every month.
      </p>
    </div>
  </div>

  {/* More Than Just Coffee Section - This will appear *after* the welcome section, also taking full screen height */}
  <div className="relative h-screen flex items-center justify-center p-2">
    {/* Left: Image */}
    <div className="w-1/2 h-full flex items-center justify-center">
      <img
        src="/mainimg.avif"
        alt="Clash Fam Coffee"
        className="object-cover h-full w-full rounded-xl"
      />
    </div>

    {/* Right: Text Section */}
    <div className="w-1/2 h-full p-2">
      <div
        className="flex rounded-xl overflow-hidden h-full"
        style={{ backgroundColor: "#f0ede9", color: "#000" }}
      >
        <div className="w-full p-8 flex flex-col justify-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: "Conneqt Black", color: "#e26c0c" }}
          >
            ALL NATURAL
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ fontFamily: "Avenir Next LT Pro Thin" }}
          >
            At Clash, we believe community is brewed one cup at a time. We're more than a
            trailer — we're a mobile gathering space fueled by culture, creativity, and
            flavor. Whether you're catching up with a friend or finding your moment of
            peace in the chaos, Clash is your sanctuary.
          </p>
        </div>
      </div>
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
