"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bell } from 'lucide-react';
import Avatar from "../ui/Avatar";
import { usePathname } from "next/navigation";
import axios from "axios";


interface Exam {
  _id: string;
  title: string;
  description?: string;
  categoryId: { _id: string; name: string };
  duration: number;
  totalMarks: number;
  marksParQue: number;
  negative: number;
  questionIds: string[];
  createdAt: string;
  scheduledDate: string; // exam ki date
  attempted: boolean;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getUpcomingSoonExams");
        setExams(res.data.data || []);
      } catch (error) {
        console.error("Error fetching exams", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

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
          <span className="font-bold text-2xl text-yellow-400">
            <span className="text-green-400">JUG</span>NU
          </span>
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
          {/* Notification */}
          <div className="relative group">
            <Bell className="text-white cursor-pointer" />
            <div className="absolute h-[15px] w-[12px] bg-red-600 rounded-full top-[1px] right-[1px] text-white text-[10px] flex justify-center items-center">
              {exams?.length || 0}
            </div>

            {/* Dropdown on hover */}
            <div className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-200">
              <div className="max-h-64 overflow-y-auto">
                {exams.length === 0 ? (
                  <p className="p-3 text-sm text-yellow-600 text-center">No upcoming exams</p>
                ) : (
                  exams.map((exam) => (
                    <div key={exam._id} className="p-3 border-b border-gray/10 last:border-none hover:bg-white/10">
                      <p className="text-sm font-semibold text-green-800 ">{exam.title}</p>
                      <p className="text-xs text-yellow-600 ">
                        {new Date(exam.scheduledDate).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {isLogin ? (
            <Link href={'#'}>
              <Avatar src="/user-icon.jpeg" size="sm" />
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg border border-white/40 text-white hover:bg-white/20">
              Login
            </Link>
          )}
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
