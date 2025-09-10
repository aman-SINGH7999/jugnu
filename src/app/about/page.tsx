"use client";

import Image from "next/image";

export default function About() {
  const team = [
    { name: "Aman Singh", role: "Founder & CEO", img: "/user-icon.jpeg" },
    { name: "Priya Sharma", role: "CTO", img: "/user-icon.jpeg" },
    { name: "Rohit Kumar", role: "Lead Designer", img: "/user-icon.jpeg" },
  ];

  const stats = [
    { label: "Students Enrolled", value: "12,000+" },
    { label: "Tests Taken", value: "50,000+" },
    { label: "Subjects Covered", value: "20+" },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-purple-800 text-white pt-28 pb-14 md:py-28">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow-[0px_2px_2px_rgba(0,0,0,0.9)]">About Our Platform</h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-lg mb-8 text-gray-300 text-shadow-[0px_2px_2px_rgba(0,0,0,0.9)]">
              Our platform is dedicated to transforming the way students learn, practice, and excel. Whether you're preparing for school exams, competitive tests, or just looking to improve your knowledge, we provide everything you need in one place. From interactive tests to detailed progress tracking, our tools make learning effective, fun, and stress-free.
            </p>
            
          </div>
          <div className="relative w-full h-80 md:h-[600px]">
  <Image 
    src="/test2.png" 
    alt="Students learning" 
    fill 
    className="rounded-2xl shadow-2xl object-cover"
    priority
  />
</div>
        </div>
      </div>

      {/* Mission / Vision */}
      <div className="max-w-6xl mx-auto px-6 py-16 flex gap-12 items-center flex-col sm:flex-row">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-purple-600">Our Mission</h2>
          <p className="mb-6 text-gray-700">
            We aim to empower students by making education accessible, engaging, and personalized. Our mission is to create a platform where learners of all levels can challenge themselves, track their growth, and achieve their academic goals confidently.
          </p>

          <h2 className="text-3xl font-bold mb-4 text-pink-500">Our Vision</h2>
          <p className="text-gray-700">
            We envision a world where every student can access high-quality learning resources anytime, anywhere. By combining innovative technology, insightful analytics, and interactive content, we strive to build a learning ecosystem that motivates and inspires students to reach their full potential.
          </p>
        </div>

        <div className="relative w-full h-80 md:h-[400px]">
          <Image src="/test.svg" alt="About illustration" fill className="object-contain" />
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Meet Our Team</h2>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-1 border-gray-500">
                <Image src={member.img} alt={member.name} width={128} height={128} className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Achievements</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="mb-6 max-w-2xl mx-auto">Join thousands of students transforming their learning journey with us.</p>
        <button className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
          Get Started
        </button>
      </div>
    </div>
  );
}
