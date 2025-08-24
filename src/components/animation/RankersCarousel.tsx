"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Ranker {
  name: string;
  subject: string;
  rank: number;
  rating: string;
  color: string; // bg-gradient class
  avatar: string;
}

const rankers: Ranker[] = [
  {
    name: "Vinod Kumar",
    subject: "Physics",
    rank: 8043,
    rating: "⭐⭐⭐",
    color: "from-pink-500 to-purple-600",
    avatar: "/user-icon.jpeg",
  },
  {
    name: "Anita Sharma",
    subject: "Chemistry",
    rank: 120,
    rating: "⭐⭐⭐⭐",
    color: "from-blue-500 to-cyan-500",
    avatar: "/user-icon.jpeg",
  },
  {
    name: "Rahul Mehta",
    subject: "Mathematics",
    rank: 45,
    rating: "⭐⭐⭐⭐⭐",
    color: "from-green-500 to-lime-500",
    avatar: "/user-icon.jpeg",
  },
  {
    name: "Kaju Mehta",
    subject: "English",
    rank: 90,
    rating: "⭐⭐⭐⭐",
    color: "from-green-500 to-lime-500",
    avatar: "/user-icon.jpeg",
  },
];

export default function RankersCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rankers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = rankers[index];

  return (
    <div className="relative w-full max-w-md mx-auto mt-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.name}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`rounded-2xl shadow-2xl overflow-hidden border border-white/20 bg-gradient-to-br ${current.color} text-white relative`}
        >
          {/* Diagonal Header */}
          <div className="absolute top-5 left-0 w-full h-16 bg-black/30 backdrop-blur-sm flex items-center justify-start px-4 transform -rotate-12 z-10">
            <span className="text-lg font-bold text-black tracking-wide">
              Top Rankers in the World
            </span>
          </div>
        <div className="h-10"></div>
          {/* Content */}
          <div className="p-6 pt-16 relative z-10">
            {/* Name & Avatar Row */}
            <div className="flex items-center space-x-4 mb-6">
              <Image
                src={current.avatar}
                alt={current.name}
                height={110}
                width={80}
                className="object-cover border-4 border-white/30 shadow-lg"
              />
              <div>
                <h2 className="text-4xl font-bold">{current.name}</h2>
                
              </div>
            </div>

            {/* Rating, Rank, Subject - Each in Box */}
            <div className="space-y-3">
              <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center justify-between">
                <span className="text-yellow-300 text-lg">{current.rating}</span>
                <span className="text-xs opacity-70">Rating</span>
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center justify-between">
                <span className="font-bold">#{current.rank}</span>
                <span className="text-xs opacity-70">Rank</span>
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center justify-between">
                <span>{current.subject}</span>
                <span className="text-xs opacity-70">Subject</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full transform rotate-45"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-tr-full transform -rotate-45"></div>
        </motion.div>
      </AnimatePresence>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {rankers.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === index ? "bg-white scale-125" : "bg-gray-400/50 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}