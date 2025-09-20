"use client";

import Header from "@/components/tests/Header";
import PracticeCard from "@/components/tests/PracticeTests";
import { useRouter } from "next/navigation";


export default function Page() {
  const router = useRouter();

  const quizzes = [
    {
      subject: "NEET Physics",
      description: "Hard NEET Questions",
      noOfQuestions: 10,
      duration: 15,
      category: "NEET",
    },
    {
      subject: "NEET Chemistry",
      description: "Organic Basics",
      noOfQuestions: 10,
      duration: 15,
      category: "NEET",
    },
    {
      subject: "NEET Biology",
      description: "Genetics Practice",
      noOfQuestions: 10,
      duration: 15,
      category: "NEET",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden text-gray-900">
        <Header heading={`Practice test with AI`} />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5 lg:p-10">
          {quizzes.map((q, idx) => (
            <PracticeCard key={q.subject} {...q} />
          ))}
        </div>
      </div>
    </div>
  )
}