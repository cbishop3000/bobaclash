"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="">
      <div 
        className="w-full flex justify-center"
      >
            <Image
                src="/giftdrinks.avif"
                alt="Clash Family Team"
                width={600} // specify the actual image width in pixels
                height={400} // specify the actual image height in pixels
                className=""
            />
        </div>
        {/* Section 2: More Than Just Coffee */}
              <div className="p-2">
                <div
                  className="flex rounded-xl overflow-hidden"
                  style={{ backgroundColor: "#f0ede9", color: "#000" }}
                >
                  {/* Left: Text */}
                  <div className="w-full p-8 flex flex-col justify-center items-center">
                    <h2
                        className="text-3xl font-bold mb-4 text-center"
                        style={{ fontFamily: "Conneqt Black", color: "#3e2608" }}
                    >
                        More Than Just Coffee
                    </h2>
                    <p
                        className="text-lg leading-relaxed text-center"
                        style={{ fontFamily: "Avenir Next LT Pro Thin" }}
                    >
                        Gift Cards are an amazing way to give to the ones you love. 
                    </p>
                    <p
                        className="text-lg leading-relaxed text-center"
                        style={{ fontFamily: "Avenir Next LT Pro Thin" }}
                    >
                        This is a great way to give a gift that is unique, fun and delicious. This is a great gift for:
                        ANNIVERSARIES, BIRTHDAYS, SHOWERS, GRADUATIONS, MOTHERS DAY,
                        FATHERS DAY, VALENTINES DAY, CHRISTMAS AND JUST BECAUSE. 
                    </p>
                    <p
                        className="text-lg leading-relaxed text-center w-3/4"
                        style={{ fontFamily: "Avenir Next LT Pro Thin" }}
                    >
                        You can order your ECARD by clicking the button below or come to our store and purchase a physical card in person.  
                    </p>

                    {/* Button at bottom */}
                    <a
                        href="https://giftcard.rezku.com/ba6ae459-190d-464a-b21c-ae6a6b8d5a16/personalize" // <-- Replace with your actual link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 px-6 py-3 bg-[#3e2608] text-white rounded-lg font-bold hover:bg-[#2d1c06] transition"
                        style={{ fontFamily: "Conneqt Black" }}
                    >
                        Order Gift Card
                    </a>
                    </div>
                </div>
              </div>
    </div>
  );
}
