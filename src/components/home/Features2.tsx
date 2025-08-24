"use client";

import { BookOpen, BarChart3, Clock } from "lucide-react";
import Image from "next/image";

export default function Features() {
  const features = [
  {
    title: "Interactive Tests",
    desc: "Challenge yourself with dynamic and interactive tests designed to boost your critical thinking and subject mastery. Our platform offers a wide range of question types, instant feedback, and adaptive difficulty levels. Whether you're preparing for exams or just want to learn by doing, our tests make learning engaging and effective.",
    icon: <BookOpen className="w-10 h-10 text-purple-500" />,
    img: "/test1.png",
    position: "left",
  },
  {
    title: "Track Your Progress",
    desc: "Stay informed about your learning journey with detailed performance analytics. View your strengths, identify areas for improvement, and monitor your growth over time with easy-to-read charts and insights. Personalized reports help you set goals and celebrate milestones along the way.",
    icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
    img: "/analysis1.png",
    position: "right",
  },
  {
    title: "Learn Anytime, Anywhere",
    desc: "With full mobile and desktop compatibility, our platform lets you learn at your own pace and on your own schedule. Access tests, review results, and continue learning whether you're at home, on the go, or offline. No barriers — just seamless, flexible education for everyone.",
    icon: <Clock className="w-10 h-10 text-pink-500" />,
    img: "/learn1.png",
    position: "left",
  },
];

  return (
    <section className="py-20 bg-gray-900">
      <div className="mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-500 text-center">
          Why Choose <span className="text-purple-600">Our Platform?</span>
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-center mb-12 tracking-wide">
          Get everything you need to learn effectively and measure your growth — all in one place.
        </p>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line */}
          
          <div className="flex flex-col bg-gray-700">
            {
              features.map((feature, i)=>{
                return (
                  <div key={i} className={`w-[100vw] flex justify-between text-black flex-col ${ i%2 == 1 ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                    
                    <div className=" sm:w-1/2 h-[500px] bg-amber-200 relative">
                        <Image src={feature.img} alt="test" fill className="object-cover" />
                    </div>

                    <div className="flex flex-col p-10 gap-2 justify-center h-full sm:w-1/2 text-center sm:text-start">
                      <h2 className="text-7xl text-gray-200 font-bold">{i+1}</h2>
                      <div className="text-3xl text-green-400 font-semibold">{feature.title}</div>
                      <p className="text-gray-300 text-lg tracking-wider">{feature.desc}</p>
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