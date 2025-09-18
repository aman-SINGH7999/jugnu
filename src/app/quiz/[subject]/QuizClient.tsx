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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold capitalize">{subject} Quiz</h1>
        {/* ✅ Timer tabhi chale jab questions aa gaye ho aur quiz submit na hua ho */}
        {!loading && !submitted && questions.length > 0 && (
          <Timer duration={60 * noOfQuestions} onTimeUp={submitQuiz} />
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading questions...</p>
      ) : !submitted ? (
        <>
          {questions.map((q, i) => (
            <Question
              key={i}
              q={q}
              index={i}
              selected={answers[i] || null}
              onSelect={(val) => setAnswers({ ...answers, [i]: val })}
            />
          ))}

          {/* ✅ Submit button tabhi dikhana jab questions aaye */}
          {questions.length > 0 && (
            <button
              onClick={submitQuiz}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          )}
        </>
      ) : (
        <Result score={score} total={questions.length} />
      )}
    </div>
  );
}
