"use client"
import Link from "next/link";
import RankersCarousel from "../animation/RankersCarousel";
import Card from "../ui/Card";
import { transform } from "next/dist/build/swc/generated-native";
import NewNotification from "../animation/NewNotification";
import MoveJugnu from "../animation/MoveJugnu";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center bg-gradient-to-br sm:bg-gradient-to-r from-blue-900 to-green-500 text-white">
          
      <div className="max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Master Your Knowledge</h1>
        <p className="text-lg md:text-xl mb-8">
          Take interactive tests, track your progress, and achieve your learning goals.
        </p>
        <Link
          href="/tests"
          className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500"
        >
          Start a Test
        </Link>
      </div>

      <div className="absolute bg-transparent hidden sm:block right-10 w-72">
        <RankersCarousel />
      </div> 
      
      <div className="absolute bg-transparent left-5 sm:left-10 top-20 w-96">
        <NewNotification />
      </div>

      <div className="absolute bg-blue-700/10 left-10 top-40 w-52 h-52 rounded-bl-full rotate-45"></div>
      <div className="absolute bg-green-700/20 left-40 top-80 w-96 h-96 rounded-b-full -rotate-[25deg]"></div>
      <div className="absolute bg-blue-700/5 right-70 -top-30 w-96 h-96 rounded-full"></div>
      <div className="absolute bg-blue-700/5 right-110 bottom-20 w-96 h-96 rounded-bl-full rotate-45"></div>

      <MoveJugnu x1={-300} y1={200} x2={-150} y2={-250} x3={0} y3={-300} size={30} time={30} />
      <MoveJugnu x1={-500} y1={100} x2={-200} y2={-400} x3={-220} y3={-100} size={25} time={40} />
      
    </section>
  );
}
