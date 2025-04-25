"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Coffee from "../public/coffee.jpg"
import ParallaxSection from "@/app/components/ParallaxSection";  // Import the ParallaxSection component

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-gray-900 text-white">
      
      {/* Welcome Section */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/path-to-your-image.jpg")',
            transform: `translateY(${scrollY * 0.3}px)`,
            height: '100%',
          }}
        ></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Welcome to Clash Fam Coffee
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            The best coffee, delivered straight to your door every month.
          </p>
          <div className="mt-6">
            <Link className="p-3 m-2 text-lg bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg transition duration-300" href="/subscribe">
              Join the Family
            </Link>
            <Link className="p-3 m-2 text-lg bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg transition duration-300" href="/subscribe">
              Make an Order
            </Link>
          </div>
        </div>
      </section>
      <section>
        <ParallaxSection 
          imageUrl={Coffee}
          title='CoffeeBG'
          description='Coffee Shop'
        />
      </section>
      {/* Why Choose Us Section */}
      <section className="w-full py-20 bg-gray-800">
        <div className="max-w-5xl mx-auto px-8 text-center text-white">
          <h2 className="text-3xl font-semibold">Why Choose Us?</h2>
          <p className="mt-4 text-lg">
            Our coffee is hand-picked, freshly roasted, and delivered to your doorstep.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">Fresh & Bold</h3>
              <p className="mt-2">Our coffee beans are roasted to perfection to deliver the best flavor.</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">Convenient</h3>
              <p className="mt-2">Delivered to your door every month, so you never run out of coffee!</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">Exclusive Perks</h3>
              <p className="mt-2">As a member, enjoy exclusive merch and discounts on all products.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
