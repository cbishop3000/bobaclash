"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand / About */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Clash Fam Coffee</h2>
          <p className="text-sm text-zinc-400">
            Bold brews. Real vibes. Monthly magic to your doorstep.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
            Navigate
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/subscribe" className="hover:text-white transition">Subscribe</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
            Follow Us
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Instagram</a></li>
            <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">TikTok</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Twitter</a></li>
          </ul>
        </div>

        {/* Newsletter / Signup */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
            Join the Fam
          </h3>
          <p className="text-sm text-zinc-400 mb-3">Get early access to drops and discounts.</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm w-full"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-md transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-xs text-zinc-500 border-t border-zinc-700 pt-6">
        © {new Date().getFullYear()} Clash Fam Coffee. All rights reserved.
      </div>
    </footer>
  );
}
