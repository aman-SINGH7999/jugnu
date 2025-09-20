"use client";

import Link from "next/link";
import { Home, LayoutDashboard, Printer } from "lucide-react"; // ✅ Lucide icons

export default function Result({
  score,
  total,
  questions,
  answers,
}: {
  score: number;
  total: number;
  questions: { question: string; options: string[]; answer: string }[];
  answers: { [key: number]: string };
}) {
  // ✅ Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="sm:p-6 bg-green-50 border rounded-lg">
      {/* ✅ Sticky Header */}
      <div className="sticky top-0 z-20 bg-green-100 border-b border-green-300 shadow-sm p-4 flex flex-wrap items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-shadow-[0_2px_2px_rgba(0,0,0,.6)]">Your Result</h2>

        {/* Buttons in header */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-shadow-[0_1px_1px_rgba(0,0,0,.6)]">Dashboard</span>
          </Link>


          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
          >
            <Printer className="w-4 h-4" />
            <span className="text-shadow-[0_1px_1px_rgba(0,0,0,.6)]">Print</span>
          </button>
        </div>
      </div>

      {/* ✅ Summary */}
      <div className="mt-6 text-center">
        <p className="mt-4 text-lg">
          Score: <span className="font-semibold">{score}</span> / {total}
        </p>
        <p className="text-gray-600 text-center mb-6">
          Percentage: {((score / total) * 100).toFixed(2)}%
        </p>
      </div>

      {/* ✅ Detailed Review */}
      <div className="space-y-4 print:space-y-2">
        {questions.map((q, i) => {
          const userAns = answers[i] || "Not Answered";
          const isCorrect = userAns === q.answer;
          return (
            <div
              key={i}
              className="p-4 border rounded bg-white shadow-sm print:shadow-none print:border-gray-400"
            >
              <h3 className="font-semibold mb-2">
                {i + 1}. {q.question}
              </h3>
              <p>
                Your Answer:{" "}
                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                  {userAns}
                </span>
              </p>
              {!isCorrect && (
                <p>
                  Correct Answer:{" "}
                  <span className="text-green-600">{q.answer}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
