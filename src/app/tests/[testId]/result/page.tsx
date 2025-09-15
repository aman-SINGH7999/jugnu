"use client";

import { useState, useEffect } from "react";
import testQuestions from "@/data/questionsAndAnswer";
import Image from "next/image";
import { useRouter  } from "next/navigation";
import ScrollToTop from "@/components/ui/ScrollToTop";

interface Question {
  id: number;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  explanation: string;
}

export default function UserResultPage({ params }: { params: { resultId: string } }) {
  const [isLogin, setIsLogin] = useState(true); // 👈 toggle this for global/user view
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setQuestions(testQuestions);

      if (isLogin) {
        const correct = testQuestions.filter((q) => q.userAnswer === q.correctAnswer).length;
        setScore(correct);
      }
      setLoading(false);
    }, 800);
  }, [params.resultId, isLogin]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg">Generating result...</p>
        </div>
      </div>
    );
  }

  const total = questions.length;
  const percentage = isLogin ? (score / total) * 100 : 0;
  const isPass = percentage >= 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
       {/* Final CTA */}
      
      {/* Header */}
      <div className="text-center py-6 md:py-10 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-6">
          Aptitude Test Result
        </h1>

        {isLogin && (
          <div className="flex flex-col sm:flex-row justify-between max-w-4xl mx-auto items-center shadow-md p-3">

            <p className="flex flex-col text-xl text-gray-700 mb-1">
              You scored{" "}
              <span className="font-bold text-blue-600">
                {score}/{total}
              </span>
            </p>

             {/* Score circle */}
            <div className="flex flex-col justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round(percentage)}%
                </span>
              </div>
            </div>

            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isPass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {isPass ? "Pass" : "Fail"}
              </span>

              <p className={`text-lg mt-2 ${isPass ? "text-green-600" : "text-red-500"}`}>
                {isPass ? "Great job! You passed 🎉" : "Keep practicing, you'll get there 🚀"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* options */}
      <div className="flex justify-between max-w-4xl mx-auto px-6 mb-2 flex-wrap">
        <button onClick={()=> router.back()} className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
          ◄ Back
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          🖨️ Print Result
        </button>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-6 pb-12 space-y-8">
        {questions.map((q) => {
          const isCorrect = q.userAnswer === q.correctAnswer;
          const wasAttempted = !!q.userAnswer;

          return (
            <div
              key={q.id}
              className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Question */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex">
                    <p className="font-semibold text-gray-800 text-lg mb-2">Q{q.id}.</p>
                    <div
                      className="prose text-gray-800 text-base"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>
                </div>

                {q.image && (
                  <div className="mt-4">
                    <Image
                      src={q.image}
                      alt="Question visual"
                      width={600}
                      height={400}
                      className="w-full max-h-72 object-contain rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Options */}
              <ul className="divide-y divide-gray-100">
                {q.options.map((option) => {
                  const isCorrectOpt = q.correctAnswer === option;
                  const isUserOpt = q.userAnswer === option;

                  const optionStyle = isLogin
                    ? isCorrectOpt
                      ? "bg-green-50 border-l-4 border-green-400"
                      : isUserOpt && !isCorrectOpt
                      ? "bg-red-50 border-l-4 border-red-400"
                      : "hover:bg-gray-50"
                    : isCorrectOpt
                    ? "bg-green-50 border-l-4 border-green-400"
                    : "hover:bg-gray-50";

                  return (
                    <li
                      key={option}
                      className={`p-3 flex items-center gap-3 transition-all duration-150 ${optionStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                          isCorrectOpt
                            ? "bg-green-500 text-white"
                            : isLogin && isUserOpt
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isCorrectOpt ? "✓" : isLogin && isUserOpt ? "✘" : ""}
                      </span>
                      <span
                        className={`${
                          isCorrectOpt
                            ? "text-green-800 font-semibold"
                            : isLogin && isUserOpt && !isCorrectOpt
                            ? "text-red-800"
                            : "text-gray-700"
                        }`}
                      >
                        {option}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Explanation */}
              <div className="p-3 bg-blue-50 border-t border-blue-100">
                <div className="flex flex-col sm:flex-row text-sm text-blue-800 leading-relaxed">
                  <div className="font-semibold">💡 Explanation: </div> 
                  <div
                      className="prose "
                      dangerouslySetInnerHTML={{ __html: q.explanation }}
                    />
                </div>
              </div>
            </div>
          );
        })}
      </div>
        <ScrollToTop />
    </div>
  );
}
