"use client";
import { useState } from "react";

export default function QuizCard({ subject, description, noOfQuestions }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  async function startQuiz() {
    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, description, noOfQuestions }),
    });
    const data = await res.json();
    setQuestions(data);
  }

  function submitQuiz() {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });
    alert(`Your Score: ${score}/${questions.length}`);
    setSubmitted(true);
  }

  return (
    <div>
      {!questions.length ? (
        <button onClick={startQuiz}>Start {subject} Quiz</button>
      ) : (
        <div>
          {questions.map((q, i) => (
            <div key={i}>
              <h3>{q.question}</h3>
              {q.options.map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={opt}
                    onChange={() => setAnswers({ ...answers, [i]: opt })}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          {!submitted && <button onClick={submitQuiz}>Submit</button>}
        </div>
      )}
    </div>
  );
}
