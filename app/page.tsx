"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // ✅ CORRECT!
import Coffee from "../public/coffee.jpg"; // Import the image for Parallax Section
import ParallaxSection from "@/app/components/ParallaxSection"; // Import the ParallaxSection component
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import WhyChooseUs from './components/WhyChooseUs';
import FeaturedVibes from './components/FeaturedVibes';

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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/coffee.jpg")', // Image in the public folder
            transform: `translateY(${scrollY * 0.3}px)`, // This creates the parallax scroll effect
            height: '100%',
          }}
        ></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"></div>
          <div className="relative z-20 px-6 py-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Welcome to Clash Fam Coffee
            </h1>
            <p className="mt-4 text-lg md:text-xl m-2 text-gray-300">
              The best coffee, delivered straight to your door every month.
            </p>
            <div className="mt-6">
              <Link className="p-3 m-2 text-lg bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg transition duration-300" href="/subscribe">
                Join the Family
              </Link>
              <Link className="p-3 m-2 text-lg bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg transition duration-300" href="https://order.rezku.com/Clash">
                Make an Order
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <FeaturedVibes />
      </section>
      {/* Parallax Section */}
      {/* <section>
        <ParallaxSection 
          imageUrl={Coffee} // Passing the image as prop
          title="CoffeeBG"
          description="Coffee Shop"
        />
      </section> */}
      <section>
        <WhyChooseUs />
      </section>
      <section>
        <Footer />
      </section>
    </main>
  );
}
