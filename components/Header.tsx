"use client";
import Link from 'next/link';

import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="w-full border-b bg-white dark:bg-[#181f2a] dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">DailyTM</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-black dark:text-white">Home</Link>
          <Link href="#features" className="text-black dark:text-white">Features</Link>
          <Link href="#pricing" className="text-black dark:text-white">Pricing</Link>
          <Link href="#about" className="text-black dark:text-white">About</Link>
          <Link href="#contact" className="text-black dark:text-white">Contact</Link>
        </nav>
        <div className="hidden md:flex items-center gap-4 relative">
          <Link href="/login" className="text-lg text-gray-700 dark:text-white">Sign In</Link>
          <Link href="/signup" className="px-6 py-2 rounded-lg text-lg font-medium shadow bg-indigo-700 hover:bg-indigo-800 text-white dark:bg-blue-700 dark:hover:bg-blue-800">Get Started</Link>
        </div>
        <button
          className="md:hidden flex items-center justify-center p-2 rounded text-gray-700 dark:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open navigation menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-4 px-4 pb-4 animate-fade-in">
          <Link href="/" className="text-black dark:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="#features" className="text-black dark:text-white" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="#pricing" className="text-black dark:text-white" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="#about" className="text-black dark:text-white" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="#contact" className="text-black dark:text-white" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/login" className="text-lg text-gray-700 dark:text-white" onClick={() => setMenuOpen(false)}>Sign In</Link>
          <Link href="/signup" className="px-6 py-2 rounded-lg text-lg font-medium shadow bg-indigo-700 hover:bg-indigo-800 text-white dark:bg-blue-700 dark:hover:bg-blue-800" onClick={() => setMenuOpen(false)}>Sign Up / Get Started</Link>
        </nav>
      )}
    </header>
  );
}