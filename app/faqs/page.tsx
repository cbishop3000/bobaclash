"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const faqItems = [
  { question: "Where are you located & hours?", answer: "We are located in [Your City]. Our hours are 8am - 8pm every day." },
  { question: "Do you do events/private events?", answer: "Yes! We host both public and private events. Please contact us for details." },
  { question: "What forms of payment do you take?", answer: "We accept cash, credit cards, Apple Pay, and Google Pay." },
  { question: "Can I put boba in any of your drinks?", answer: "Yes, boba can be added to most of our drinks. Just ask!" },
  { question: "Do you have sugar free options?", answer: "Absolutely. We have sugar-free syrups and unsweetened tea options." },
  { question: "Do you have milk alternatives?", answer: "Yes, we offer oat, almond, and soy milk alternatives." },
  { question: "Where is your coffee from?", answer: "Our coffee is ethically sourced from family-run farms in South America." },
  { question: "Where do you get your tea from?", answer: "We source our teas from organic farms around the world." },
  { question: "The teas we carry are:", answer: "Green tea, black tea, oolong, jasmine, chamomile, and seasonal blends." },
  { question: "Why is your Thai tea not orange?", answer: "Traditional Thai tea isn't naturally orange. The bright color comes from food dye, which we avoid." },
  { question: "Do you have social media?", answer: "Yes! Follow us on Instagram and Facebook @YourCafeHandle." },
  { question: "Do you do online ordering/delivery?", answer: "Yes, you can order online through our website or delivery apps like DoorDash and UberEats." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-full bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">FAQ Page</h1>
        <button
          className="md:hidden block mb-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`${menuOpen ? "block" : "hidden"} md:block space-y-4`}>
          {faqItems.map((item, index: number) => (
            <div key={index}>
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-left font-semibold bg-gray-700 p-2 rounded hover:bg-gray-600"
              >
                {item.question}
              </button>
              {openIndex === index && (
                <div className="bg-gray-600 p-3 mt-1 rounded text-sm">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
