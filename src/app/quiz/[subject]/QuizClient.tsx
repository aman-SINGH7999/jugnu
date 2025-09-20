"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Question from "@/components/tests/Question";
import Timer from "@/components/tests/Timer";
import Result from "@/components/tests/Result";

interface QuestionType {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizClient({ subject }: { subject: string }) {
  const searchParams = useSearchParams();
  const description = searchParams.get("desc") || "";
  const noOfQuestions = Number(searchParams.get("n")) || 5;

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentQ, setCurrentQ] = useState(0);

  function submitQuiz() {
    let sc = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) sc++;
    });
    setScore(sc);
    setSubmitted(true);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, description, noOfQuestions }),
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Failed to fetch questions", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [subject, description, noOfQuestions]);

  if (loading) {
    return <p className="text-gray-500 text-center mt-10">Loading questions...</p>;
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {/* ✅ Left Sidebar for Navigation */}
      {!submitted && questions.length > 0 && (
        <div className="hidden md:block w-1/5 p-4 border-r">
          <h3 className="font-semibold mb-3">Questions</h3>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((_, i) => {
              let bg = "bg-gray-200";
              if (currentQ === i) bg = "bg-yellow-400";
              else if (answers[i]) bg = "bg-green-400";
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-10 h-10 rounded-full text-sm font-bold ${bg}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ Main Content */}
      <div className="flex-1">
        {/* Fixed Header */}
        {!submitted && questions.length > 0 && (
          <div className="sticky top-0 z-10 bg-white border-b shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-bold capitalize">{subject} Quiz</h1>
            <p>Total: {questions.length}</p>
            <Timer duration={60 * noOfQuestions} onTimeUp={submitQuiz} />
            <button
              onClick={submitQuiz}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Submit
            </button>
          </div>
        )}

        <div className="p-6">
          {!submitted ? (
            <>
              {/* ✅ Single Question Display */}
              {questions[currentQ] && (
                <Question
                  q={questions[currentQ]}
                  index={currentQ}
                  selected={answers[currentQ] || null}
                  onSelect={(val) => setAnswers({ ...answers, [currentQ]: val })}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentQ((prev) => Math.max(0, prev - 1))}
                  disabled={currentQ === 0}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentQ((prev) => Math.min(questions.length - 1, prev + 1))
                  }
                  disabled={currentQ === questions.length - 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <Result
              score={score}
              total={questions.length}
              questions={questions}
              answers={answers}
            />
          )}
        </div>
      </div>
    </div>
  );
}
