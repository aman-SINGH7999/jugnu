'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Timer from '@/components/runningTest/Timer';
import QuestionCard from '@/components/runningTest/QuestionCard';
import QuestionNavigator from '@/components/runningTest/QuestionNavigator';
import { useAuth } from '@/lib/useAuth';

export default function TestPage() {
  const router = useRouter();
  const params = useParams() as { testId?: string };
  const testId = params?.testId;
  const { user } = useAuth();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!testId) return;
    const fetchExam = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/getSafeExamById/${testId}`);
        if (res.data.success) {
          setExam(res.data.data);
          setQuestions(res.data.data.questions || []);
        } else {
          alert(res.data.message || "Failed to load exam");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching exam");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [testId]);

  const handleAnswer = (qid: string, optIndex: number) => {
    setAnswers(prev => {
      const prevAnswers = prev[qid] || [];
      const exists = prevAnswers.includes(optIndex);
      const newAnswers = exists ? prevAnswers.filter(o => o !== optIndex) : [...prevAnswers, optIndex];

      if (newAnswers.length === 0) {
        const { [qid]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [qid]: newAnswers };
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!confirm("Are you sure you want to submit the test?")) return;
    setIsSubmitting(true);
    try {
      const payload = {
        examId: testId,
        userId: user?.id, // ideally server should derive user from auth token/session
        answers, // index-based answers: { "<questionId>": [0,2], ... }
      };
      const res = await axios.post('/api/submitExam', payload);
      if (res.data.success) {
        alert("Exam submitted successfully!");
        router.push(`/tests/${testId}/thankyou`);
      } else {
        alert("Failed to submit exam: " + res.data.message);
      }
    } catch (err) {
      console.log("Error in exam submit: ", err);
      alert("Error submitting exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading exam...</p>;
  if (!exam) return <p className="p-6 text-center text-red-600">Exam not found</p>;

  const currentQuestion = questions[currentQ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-700">
      <header className="flex items-center justify-between px-6 py-3 bg-gray-100 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-600">{exam.title}</h1>
        <Timer duration={exam.duration * 60} onTimeUp={handleSubmit} />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Test"}
        </button>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:block w-1/4 bg-gray-50 border-r p-4 overflow-y-auto">
          <QuestionNavigator
            questions={questions}
            answers={answers}
            currentQ={currentQ}
            onSelect={(idx) => setCurrentQ(idx)}
          />
        </aside>

        <main className="flex-1 p-6">
          <QuestionCard
            question={currentQuestion}
            selected={answers[String(currentQuestion?._id)] || []}
            onSelect={(optIndex) => handleAnswer(String(currentQuestion._id), optIndex)}
          />

          <div className="flex justify-between mt-6">
            <button
              disabled={currentQ === 0}
              onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={currentQ === questions.length - 1}
              onClick={() => setCurrentQ((q) => Math.min(questions.length - 1, q + 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
