"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={35} height={35} />
          <span className="font-bold text-xl text-white">JUGNU</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-white font-medium">
          <Link href="/tests" className="hover:text-blue-400">Tests</Link>
          <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/about" className="hover:text-blue-400">About</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded-lg border border-white/40 text-white hover:bg-white/20">
            Login
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg text-white flex flex-col items-center py-6 space-y-4">
          <Link href="/tests" onClick={() => setIsOpen(false)}>Tests</Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
          <Link href="/register" onClick={() => setIsOpen(false)} className="bg-blue-500 px-4 py-2 rounded-lg">
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}
