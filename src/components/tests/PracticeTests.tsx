"use client";

import React from "react";
import { Clock, HelpCircle, Tag, Calendar, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface PracticeCardProps {
  subject: string;
  description: string;
  noOfQuestions: number;
  duration: number; // in minutes
  category?: string;
}

const PracticeCard: React.FC<PracticeCardProps> = ({
  subject,
  description,
  noOfQuestions,
  duration,
  category,
}) => {

  const router = useRouter();

  return (
    <div
      className="relative bg-gradient-to-br from-green-50 via-white to-green-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between border border-green-100 hover:border-green-400 hover:-translate-y-0"
    >
      <BookOpen className="w-10 h-10 my-2 text-green-600" />
      {/* Title */}
      <h2 className="text-2xl font-bold text-green-800 mb-2">{subject}</h2>

      {/* Description */}
      {description && (
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {/* Info */}
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-green-600" />
          <span>{noOfQuestions} Questions</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-600" />
          <span>{duration} min</span>
        </div>
      </div>

      {/* Extra info */}
      <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
        {category && (
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3 text-green-500" />
            <span>{category}</span>
          </div>
        )}
      </div>

      {/* Action button */}
      <button onClick={()=> router.push(`/quiz/${subject.toLowerCase()}?desc=${description}&n=${noOfQuestions}`)} className="mt-5 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
        Start Practice
      </button>
    </div>
  );
};

export default PracticeCard;