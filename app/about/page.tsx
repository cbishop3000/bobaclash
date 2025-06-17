"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const images = [
  { src: "/beans.avif", alt: "Slide 1" },
  { src: "/boba.avif", alt: "Slide 2" },
  { src: "/herbs.avif", alt: "Slide 3" }
];

export default function AboutPage() {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="bg-black text-white space-y-20 p-6">
      {/* Section 1: Carousel + About */}
      <div className="flex">
        {/* Left: Carousel */}
        <div className="w-1/2 pr-6 flex flex-col">
          <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex justify-center gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`w-24 h-16 relative cursor-pointer rounded overflow-hidden border-2 ${
                  selectedImage === idx ? "border-amber-500" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(idx)}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: About Text */}
        <div className="w-1/2 flex flex-col">
          <h1
            className="text-4xl font-bold mb-6"
            style={{ fontFamily: "Conneqt Black" }}
          >
            About Us
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ fontFamily: "Avenir Next LT Pro Thin" }}
          >
            We are an all natural company. We make all of our syrups from scratch
            using high quality ingredients. We use local produce, when in season.
            Our coffee is direct trade and roasted locally. Our teas are direct
            trade, loose leaf teas, brewed daily. Our boba is sweetened with brown
            sugar and honey. We use real fruit, pure extracts and make our caramel
            and chocolate in house. We are in a coffee trailer and go to different
            locations. Please check our schedule on Instagram @clash.coffee.boba to
            know where to find us. We are opening a new location soon — please check
            back for our OPENING DATE.
          </p>
        </div>
      </div>

      {/* Section 2: More Than Just Coffee */}
      <div className="p-2">
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ backgroundColor: "#f0ede9", color: "#000" }}
        >
          {/* Left: Text */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "Conneqt Black", color: "#235e1f" }}
            >
              More Than Just Coffee
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ fontFamily: "Avenir Next LT Pro Thin" }}
            >
              At Clash, we believe community is brewed one cup at a time. We're more
              than a trailer — we're a mobile gathering space fueled by culture,
              creativity, and flavor. Whether you're catching up with a friend or
              finding your moment of peace in the chaos, Clash is your sanctuary.
            </p>
          </div>

          {/* Right: Image */}
          <div className="w-1/2 relative h-[400px]">
            <Image
              src="/family.avif" // Make sure this image exists in /public
              alt="Community"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Clash Family Title */}
      <section className="text-center">
        <h2
          className="text-4xl font-bold"
          style={{ fontFamily: "Conneqt Black" }}
        >
          Clash Family
        </h2>
        <h3
          className="text-4xl font-bold"
          style={{ fontFamily: "Avenir Next LT Pro Thin", color: "#235e1f" }}
        >
          REAL PEOPLE, REAL INGREDIENTS, REAL GOOD 
        </h3>
        <p
            className="text-lg leading-relaxed"
            style={{ fontFamily: "Avenir Next LT Pro Thin" }}
        >
            OUR FAMILY'S PASSION IS TO CAPTURE THE BEAUTIFUL ESSENCE OF WHAT NATURE HAS TO OFFER. WE STRIVE TO BRING DELICIOUS, HEALTHY, LOCAL AND SUSTAINABLE OPTIONS TO OUR BUSINESS AND PRODUCTS.  WE WANT TO GIVE OUR CUSTOMERS A HEALTHY, YET DELICIOUS ALTERNATIVE TO THE TRADITIONAL COFFEE MARKET, OFFERING REAL INGREDIENTS THAT ARE GOOD FOR YOU AND GOOD FOR OUR EARTH, WHILE KEEPING OUR PRICES COMPETITIVE TO OTHER COFFEE CHAINS. 
        </p>
      </section>
      {/* Section 3: Clash Family Title */}
<section className="text-center">
  <h2
    className="text-4xl font-bold"
    style={{ fontFamily: "Conneqt Black" }}
  >
    Clash Family
  </h2>
  <h3
    className="text-4xl font-bold"
    style={{ fontFamily: "Avenir Next LT Pro Thin", color: "#235e1f" }}
  >
    REAL PEOPLE, REAL INGREDIENTS, REAL GOOD 
  </h3>
  <p
    className="text-lg leading-relaxed max-w-4xl mx-auto"
    style={{ fontFamily: "Avenir Next LT Pro Thin" }}
  >
    OUR FAMILY'S PASSION IS TO CAPTURE THE BEAUTIFUL ESSENCE OF WHAT NATURE HAS TO OFFER. WE STRIVE TO BRING DELICIOUS, HEALTHY, LOCAL AND SUSTAINABLE OPTIONS TO OUR BUSINESS AND PRODUCTS.  WE WANT TO GIVE OUR CUSTOMERS A HEALTHY, YET DELICIOUS ALTERNATIVE TO THE TRADITIONAL COFFEE MARKET, OFFERING REAL INGREDIENTS THAT ARE GOOD FOR YOU AND GOOD FOR OUR EARTH, WHILE KEEPING OUR PRICES COMPETITIVE TO OTHER COFFEE CHAINS. 
  </p>

  {/* New Contact Box */}
  <div
    className="flex flex-col md:flex-row items-center gap-6 mt-10 p-6 rounded-lg max-w-5xl mx-auto"
    style={{ backgroundColor: "#235e1f" }}
  >
    {/* Left: Image */}
    <div className="w-full md:w-1/2 relative h-48 md:h-64 rounded-lg overflow-hidden">
      <Image
        src="/billteresa.avif" // Replace with your image path
        alt="Clash Family Team"
        fill
        className="object-cover rounded-lg"
      />
    </div>

    {/* Right: Text and Contact */}
    <div className="w-full md:w-1/2 text-white flex flex-col justify-center">
      <h4 className="text-2xl font-bold mb-4" style={{ fontFamily: "Conneqt Black" }}>
        COO
      </h4>
      <h4 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: "Conneqt Black" }}>
        Bill Beukers
      </h4>
      <p className="mb-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
        Otherwise known as "Baba Boba" or "Papa Clash" is the visionary  behind Clash. His extensive background in the restaurant industry has made Clash a brand that is unlike any other. Each drink has been meticulously crafted from his food knowledge, passion for healthy alternatives and creative mind. He is a customer service genius and is well known for his humor, outgoing personality and integrity. 
      </p>
      <h4 className="text-2xl font-bold mb-4" style={{ fontFamily: "Conneqt Black" }}>
        CEO
      </h4>
      <h4 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: "Conneqt Black" }}>
        Teresa Beukers
      </h4>
      <p className="mb-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
        Otherwise known as "Baba Boba" or "Papa Clash" is the visionary  behind Clash. His extensive background in the restaurant industry has made Clash a brand that is unlike any other. Each drink has been meticulously crafted from his food knowledge, passion for healthy alternatives and creative mind. He is a customer service genius and is well known for his humor, outgoing personality and integrity. 
      </p>
    </div>
  </div>
</section>

    </div>
  );
}
