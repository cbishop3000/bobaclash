"use client";
import { useState } from "react";

export default function FooterContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, to: "clashcoffeeboba@gmail.com" }),
      });

      if (res.ok) {
        alert("Message sent!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("Failed to send. Try again.");
      }
    } catch (err) {
      alert("An error occurred. Try again.");
    }
  };

  return (
    <footer
      className="relative bg-white bg-cover bg-center text-zinc-900 py-16 px-6"
      style={{
        backgroundImage: `url('/whitemarble.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

      <div className="relative max-w-3xl mx-auto z-10 text-center">
        <h2 className="text-3xl font-bold mb-4 text-green-800">Get In Touch With Us</h2>
        <p className="text-zinc-700 mb-8">We'd love to hear from you. Drop us a line below.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-white border border-zinc-300 focus:ring-amber-500 focus:ring-2 outline-none w-full text-sm text-black"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-white border border-zinc-300 focus:ring-amber-500 focus:ring-2 outline-none w-full text-sm text-black"
            />
          </div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
            className="px-4 py-2 rounded-md bg-white border border-zinc-300 focus:ring-amber-500 focus:ring-2 outline-none w-full text-sm text-black"
          />
          <textarea
            name="message"
            required
            placeholder="Your message..."
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="px-4 py-2 rounded-md bg-white border border-zinc-300 focus:ring-amber-500 focus:ring-2 outline-none w-full text-sm text-black"
          />
          <button
            type="submit"
            className="bg-green-800 hover:bg-amber-400 text-black font-semibold px-6 py-2 rounded-md transition w-full sm:w-auto"
          >
            Send it now
          </button>
        </form>

        <p className="mt-10 text-xs text-zinc-600">© {new Date().getFullYear()} Clash Fam Coffee. All rights reserved.</p>
      </div>
    </footer>
  );
}
