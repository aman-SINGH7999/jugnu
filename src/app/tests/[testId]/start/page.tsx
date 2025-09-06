'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '@/components/runningTest/Timer';
import QuestionCard from '@/components/runningTest/QuestionCard';
import QuestionNavigator from '@/components/runningTest/QuestionNavigator';

export default function TestPage() {
  const router = useRouter();

  // Sample test data (replace with API data)
  const questions = [
  { id: 1, text: "What is 2 + 2?", options: ["2", "3", "4", "5"] },
  { id: 2, text: "Capital of France?", options: ["Berlin", "London", "Paris", "Madrid"] },
  { id: 3, text: "H2O is?", options: ["Oxygen", "Water", "Hydrogen", "Carbon"] },
  { id: 4, text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"] },
  { id: 5, text: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Shark"] },
  { id: 6, text: "How many continents are there?", options: ["5", "6", "7", "8"] },
  { id: 7, text: "Which gas do plants absorb during photosynthesis? Which gas do plants absorb during photosynthesis? Which gas do plants absorb during photosynthesis? v v Which gas do plants absorb during photosynthesis? Which gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"] },
  { id: 8, text: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"] },
  { id: 9, text: "What is the square root of 64?", options: ["6", "7", "8", "9"] },
  { id: 10, text: "Which country is known as the Land of the Rising Sun?", options: ["China", "South Korea", "Thailand", "Japan"] },
  { id: 11, text: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"] },
  { id: 12, text: "Which is the smallest prime number?", options: ["0", "1", "2", "3"] },
  { id: 13, text: "Which organ pumps blood in the human body?", options: ["Lungs", "Brain", "Heart", "Liver"] },
  { id: 14, text: "Which language is primarily spoken in Brazil?", options: ["Spanish", "Portuguese", "English", "French"] },
  { id: 15, text: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"] },
  { id: 16, text: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"] },
  { id: 17, text: "What force pulls objects toward the Earth?", options: ["Magnetism", "Friction", "Gravity", "Tension"] },
  { id: 18, text: "Which planet has rings around it?", options: ["Mars", "Venus", "Saturn", "Mercury"] },
  { id: 19, text: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"] },
  { id: 20, text: "Which animal is known as the 'Ship of the Desert'?", options: ["Camel", "Horse", "Elephant", "Donkey"] },
  { id: 21, text: "Which is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"] },
  { id: 22, text: "Who discovered gravity?", options: ["Albert Einstein", "Isaac Newton", "Galileo", "Thomas Edison"] },
  { id: 23, text: "Which part of the plant conducts photosynthesis?", options: ["Root", "Stem", "Leaf", "Flower"] },
  { id: 24, text: "What is 15 × 4?", options: ["50", "60", "70", "80"] },
  { id: 25, text: "Which country hosted the 2024 Olympics?", options: ["Japan", "France", "USA", "Australia"] },
  { id: 26, text: "Which is the fastest land animal?", options: ["Lion", "Cheetah", "Leopard", "Horse"] },
  { id: 27, text: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"] },
  { id: 28, text: "Which is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"] },
  { id: 29, text: "How many bones are in the human body?", options: ["206", "300", "150", "187"] },
  { id: 30, text: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"] },
   // ✅ TEST CASES (ID 31+)
  {
    id: 31,
    text: "This is a <strong>bold question</strong> with <em>HTML</em> and a <br>line break.<br><br>Testing <code>code</code> and <mark>highlight</mark>.",
    options: [
      "Option with <b>bold</b>",
      "Option with <i>italic</i>",
      "Normal option",
      "Long option with lots of text to test wrapping: This is a very long option to see how it wraps on small screens and maintains padding."
    ]
  },
  {
    id: 32,
    text: "This question has an image:",
    image: "/test-image.jpg", // Make sure this image exists in public/ folder
    options: ["Option 1", "Option 2", "Option 3", "Option 4"]
  },
  {
    id: 33,
    text: "Which one is correct?",
    options: ["✅ Correct Answer", "❌ Wrong", "⚠️ Maybe", "🚫 Nope"]
  },
  {
    id: 34,
    text: "Very long question text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. This tests how long text wraps and maintains readability inside the card.",
    options: ["Short", "Medium length option", "This is a very long option to test horizontal space and wrapping", "Last option"]
  },
  {
    id: 35,
    text: "Math question: What is <i>E = mc²</i>?",
    options: ["Energy formula", "Newton's law", "Boyle's law", "Ohm's law"]
  }
];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | null }>({});

  const handleAnswer = (qid: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit the test?")) {
      console.log("Submitted answers:", answers);
      router.push('/tests/2/thankyou'); // redirect after submit
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-700">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-gray-100 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-600"> Aptitude Test</h1>
        <Timer duration={60 * 30} onTimeUp={handleSubmit} /> {/* 30 min */}
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Submit Test
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block w-1/4 bg-gray-50 border-r p-4 overflow-y-auto">
          <QuestionNavigator
            questions={questions}
            answers={answers}
            currentQ={currentQ}
            onSelect={(idx) => setCurrentQ(idx)}
          />
        </aside>

        {/* Main Question Area */}
        <main className="flex-1 p-6">
          <QuestionCard
            question={questions[currentQ]}
            selected={answers[questions[currentQ].id]}
            onSelect={(opt) => handleAnswer(questions[currentQ].id, opt)}
          />

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              disabled={currentQ === 0}
              onClick={() => setCurrentQ((q) => q - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={currentQ === questions.length - 1}
              onClick={() => setCurrentQ((q) => q + 1)}
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
