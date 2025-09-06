'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, BookOpen, Clock, Shield } from 'lucide-react';

export default function InstructionsPage() {
  const router = useRouter();

  const instructions = [
    { title: "Duration", desc: "60 minutes (timer will start automatically)." },
    { title: "Negative Marking", desc: "-1 for each incorrect answer. No penalty for unattempted." },
    { title: "Navigation", desc: "Do not switch tabs or minimize the window. Doing so may lead to disqualification." },
    { title: "Internet", desc: "Ensure stable internet connection. Page refresh may reset your progress." },
    { title: "Honesty", desc: "This is an assessment of your knowledge. Do not use external help." },
    { title: "Submission", desc: "Test will auto-submit when time ends, but you may submit early." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl max-w-3xl w-full p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Test Instructions</h1>
          <p className="text-gray-600 mt-2 text-base">
            Please read all the instructions carefully before you proceed.
          </p>
        </div>

        {/* Instructions List */}
        <div className="bg-gray-50 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Important Guidelines
          </h2>
          <ul className="space-y-4 text-gray-700 text-sm leading-relaxed">
            {instructions.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="font-semibold text-gray-800">{item.title}:</span>
                <span>{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-8 flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <p className="text-yellow-800">
            <strong>Warning:</strong> Any suspicious activity (like multiple tab switches) will be logged.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Back
          </button>
          <button
            onClick={() => router.push('./permissions')}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            I Understand & Continue
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Need help? Contact <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a>
        </p>
      </div>
    </div>
  );
}
