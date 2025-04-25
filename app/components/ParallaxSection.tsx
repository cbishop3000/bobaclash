"use client"
import { useEffect, useState } from 'react';
import { StaticImageData } from 'next/image';

interface ParallaxSectionProps {
  imageUrl: string | StaticImageData;
  title: string;
  description: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ imageUrl, title, description }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transform: `translateY(${scrollY * 0.3}px)`,
          height: '100%',
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">{title}</h1>
        <p className="mt-4 text-lg md:text-xl text-white">{description}</p>
      </div>
    </section>
  );
}

export default ParallaxSection;
