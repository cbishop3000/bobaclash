"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const images = [
  { src: "/lemons.avif", alt: "Slide 1" },
  { src: "/beans.avif", alt: "Slide 2" },
  { src: "/boba.avif", alt: "Slide 3" },
  { src: "/herbs.avif", alt: "Slide 4" }
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
    {/* New Contact Box */}
    <div
        className="flex flex-col md:flex-row items-center gap-6 mt-10 p-6 rounded-lg max-w-5xl mx-auto"
        style={{ backgroundColor: "#235e1f" }}
    >
        {/* Left: Image */}
        <div className="w-full md:w-1/2 rounded-lg overflow-visible flex justify-center">
            <Image
                src="/billteresa.avif"
                alt="Clash Family Team"
                width={600} // specify the actual image width in pixels
                height={400} // specify the actual image height in pixels
                className="object-contain rounded-lg"
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
            <p className="w-full text-center text-white mt-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
            clashcoffeeboba@gmail.com
            </p>
        </div>
        
    </div>
    </section>
    <section className="text-center">
    {/* New Contact Box 2*/}
    <div
        className="flex flex-col md:flex-row items-center gap-6 mt-10 p-6 rounded-lg max-w-5xl mx-auto"
        style={{ backgroundColor: "#235e1f" }}
    >
        {/* Left: Image */}
        <div className="w-full md:w-1/2 rounded-lg overflow-visible flex justify-center">
            <Image
                src="/noahcallie.avif"
                alt="Clash Family Team"
                width={600} // specify the actual image width in pixels
                height={400} // specify the actual image height in pixels
                className="object-contain rounded-lg"
            />
        </div>


        {/* Right: Text and Contact */}
        <div className="w-full md:w-1/2 text-white flex flex-col justify-center">
        <h4 className="text-2xl font-bold mb-4" style={{ fontFamily: "Conneqt Black" }}>
            CFO
        </h4>
        <h4 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: "Conneqt Black" }}>
            Noah Beukers
        </h4>
        <p className="mb-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
Otherwise known as "YOYO" is the middle child of Bill & Teresa Beukers. Noah is the mastermind behind the name "CLASH" and face behind the "Clashmobile". He ensures all of the financials are in order and has an amazing mentoring team to help him be the best CFO for our company. He also manages the Clashmobile and helps with the operations for events. He is married to Callie and they have 3 beautiful children.         </p>
        <h4 className="text-2xl font-bold mb-4" style={{ fontFamily: "Conneqt Black" }}>
            MAMA CLASHOLOGIST
        </h4>
        <h4 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: "Conneqt Black" }}>
            Callie Beukers
        </h4>
        <p className="mb-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
Otherwise known as "The Calster" is responsible for the most popular drink, our Mt. Caramel. Her recipe has become a favorite to most of our customers. She is a SAHM and one of our Clashologist. 
Callie also caters all of our events with her amazing charcuiterie boards through her business Fig & Vine.        </p>
            <p className="w-full text-center text-white mt-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
            clashcbl21@gmailcom
            </p>
        </div>
        
    </div>
    </section>
    <section className="text-center">
    {/* New Contact Box 3*/}
    <div
        className="flex flex-col md:flex-row items-center gap-6 mt-10 p-6 rounded-lg max-w-5xl mx-auto"
        style={{ backgroundColor: "#235e1f" }}
    >
        {/* Left: Image */}
        <div className="w-full md:w-1/2 rounded-lg overflow-visible flex justify-center">
            <Image
                src="/elibre.avif"
                alt="Clash Family Team"
                width={600} // specify the actual image width in pixels
                height={400} // specify the actual image height in pixels
                className="object-contain rounded-lg"
            />
        </div>


        {/* Right: Text and Contact */}
        <div className="w-full md:w-1/2 text-white flex flex-col justify-center">
        <h4 className="text-2xl font-bold mb-4" style={{ fontFamily: "Conneqt Black" }}>
            IT MANAGER
        </h4>
        <h4 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: "Conneqt Black" }}>
            Elijah Beukers
        </h4>
        <p className="mb-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
Otherwise known as "The Brains" is the oldest child of Bill & Teresa Beukers. He is exceptional in all things digital. He is the brainiac behind all the back of the house computer/POS system functions and helps everything run smoothly, effectively and efficiently. He also helps manage the store. He is married to Breanna and they have 2 amazing boys. </p>
        <h4 className="text-2xl font-bold mb-4" style={{ fontFamily: "Conneqt Black" }}>
            MAMA CLASHOLOGIST
        </h4>
        <h4 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: "Conneqt Black" }}>
            Breanna Beukers
        </h4>
        <p className="mb-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
Otherwise known as "Bree Bee" is our master networker. If you have met her, you know about Clash. She is our go-fer, always ready to help wherever she is needed. She is a SAHM and one of our Clashologist. She takes care of her grandmother and has a heart of gold.        </p>
            <p className="w-full text-center text-white mt-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
            clashcoffeeboba@gmail.com
            </p>
        </div>
        
    </div>
    </section>
    <section className="text-center">
    {/* New Contact Box 3*/}
    <div
        className="flex flex-col md:flex-row items-center gap-6 mt-10 p-6 rounded-lg max-w-5xl mx-auto"
        style={{ backgroundColor: "#235e1f" }}
    >
        {/* Left: Image */}
        <div className="w-full md:w-1/2 rounded-lg overflow-visible flex justify-center">
            <Image
                src="/carahb.avif"
                alt="Clash Family Team"
                width={600} // specify the actual image width in pixels
                height={400} // specify the actual image height in pixels
                className="object-contain rounded-lg"
            />
        </div>


        {/* Right: Text and Contact */}
        <div className="w-full md:w-1/2 text-white flex flex-col justify-center">
        <h4 className="text-2xl font-bold mb-4" style={{ fontFamily: "Conneqt Black" }}>
            SOCIAL MEDIA MANAGER
        </h4>
        <h4 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: "Conneqt Black" }}>
            Carah Beukers
        </h4>
        <p className="mb-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
Otherwise known as "PITA" is the youngest and only girl of Bill & Tersa Beukers. Carah is our Social Media Manager. She makes all of our videos and is the "face" of Clash. She is an influencer and makes all kinds of videos on her platforms. She is also an interior designer and professional organizer. She is single and living her best life traveling </p>
        <h4 className="text-2xl font-bold mb-4" style={{ fontFamily: "Conneqt Black" }}>
            TASTE TESTERS (not pictured)
        </h4>
        <h4 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: "Conneqt Black" }}>
            The Beukers' grandchildren
        </h4>
        <p className="mb-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
Otherwise known as the cutest  children EVER! Baba & Nanoo Beukers have 5 amazing grandchildren. They are our official taste testers. On our days off, they come and make drinks and check to make sure they are up the par. They are our "quality control" team. On occasion you will see them in the store.         </p>
            <p className="w-full text-center text-white mt-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
                instagram @theadventuresofcarah
            </p>
            <p className="w-full text-center text-white mt-6" style={{ fontFamily: "Avenir Next LT Pro Thin" }}>
                tiktok @theadventuresofcarah
            </p>
        </div>
        
    </div>
    </section>
    </div>
  );
}
