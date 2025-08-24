"use client";

import { BookOpen, BarChart3, Clock } from "lucide-react";
import Image from "next/image";

export default function Features() {
  const features = [
  {
    title: "Interactive Tests",
    desc: "Engaging tests with instant feedback across subjects. Designed to challenge and improve your understanding through practice.",
    icon: <BookOpen className="w-10 h-10 text-purple-500" />,
    img: "/test.svg",
    position: "left",
  },
  {
    title: "Track Your Progress",
    desc: "Clear insights into your performance with visual analytics. Monitor growth, spot weak areas, and stay motivated.",
    icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
    img: "/analysis.svg",
    position: "right",
  },
  {
    title: "Learn Anytime",
    desc: "Access content on any device, anytime. Learn at your pace, whether online or offline — no interruptions.",
    icon: <Clock className="w-10 h-10 text-pink-500" />,
    img: "/learn.svg",
    position: "left",
  },
];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-500 text-center">
          Why Choose <span className="text-purple-600">Our Platform?</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
          Get everything you need to learn effectively and measure your growth — all in one place.
        </p>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute hidden lg:block left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500"></div>
          <div className="flex flex-col gap-20 h-full">
            {
              features.map((feature, i)=>{
                return (
                  <div key={i} className={`w-full flex items-center sm:items-start sm:justify-around text-black flex-col ${ i%2 == 1 ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                    <div>
                      <Image src={feature.img} alt="test" width={300} height={300} />
                    </div>
                    <div className="absolute hidden lg:block left-1/2 transform -translate-x-1/2 w-10 h-10 bg-blue-500"></div>
                    <div className="flex flex-col justify-center h-full w-9/12 sm:w-1/2 lg:w-1/3 text-center sm:text-start">
                      <h2 className="text-6xl text-gray-400 font-bold">{i+1}</h2>
                      {/* <div>{feature.icon}</div> */}
                      <div className="text-3xl text-gray-700 font-semibold">{feature.title}</div>
                      <p className="text-gray-500 text-lg">{feature.desc}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </section>
  );
}