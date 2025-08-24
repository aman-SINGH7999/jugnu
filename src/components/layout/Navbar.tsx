"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Bell } from 'lucide-react';
import Avatar from "../ui/Avatar";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const pathname = usePathname();


  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        
         {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none text-2xl"
        >
          ☰
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={35} height={35} />
          <span className="font-bold text-2xl text-yellow-400"><span className="text-green-400">JUG</span>NU</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-white font-medium">
          <Link href="/tests" className={`hover:text-green-400 ${pathname === "/tests" && 'text-yellow-400'}`}>Tests</Link>
          <Link href="/dashboard" className={`hover:text-green-400 ${pathname === "/dashboard" && 'text-yellow-400'}`}>Dashboard</Link>
          <Link href="/leaderboard" className={`hover:text-green-400 ${pathname === "/leaderboard" && 'text-yellow-400'}`}>Leaderboard</Link>
          <Link href="/about" className={`hover:text-green-400 ${pathname === "/about" && 'text-yellow-400'}`}>About</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Bell />
            <div className="absolute h-[9px] w-[9px] bg-red-600 rounded-full top-[2px] right-[2px]"></div>
          </div>
          {
            isLogin ? <Link href={'#'}><Avatar src="/user-icon.jpeg" size="sm" /></Link>
            : <Link href="/login" className="px-4 py-2 rounded-lg border border-white/40 text-white hover:bg-white/20">
                Login
              </Link>
          }
          
        </div>

       
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg text-white flex flex-col items-center py-6 space-y-4">
          <Link href="/tests" onClick={() => setIsOpen(false)}>Tests</Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link href="/leaderboard" onClick={() => setIsOpen(false)}>Leaderboard</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
        </div>
      )}
    </header>
  );
}
