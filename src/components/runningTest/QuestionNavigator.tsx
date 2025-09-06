'use client';

export default function QuestionNavigator({ 
  questions, 
  answers, 
  currentQ, 
  onSelect 
}: {
  questions: { id: number; text: string }[];
  answers: Record<number, any>;
  currentQ: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3 text-center sm:text-left">📌 Questions</h3>
      
      {/* Responsive Grid */}
      <div className="flex flex-wrap gap-2 px-1">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = idx === currentQ;

          return (
            <button
              key={q.id}
              onClick={() => onSelect(idx)}
              aria-label={`Go to question ${idx + 1}`}
              className={`
                w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : isAnswered
                    ? 'bg-green-400 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
                ${isCurrent ? 'focus:ring-blue-400' : 'focus:ring-gray-300'}
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span>Not Attempted</span>
        </span>
        <span className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-400 border border-green-800 rounded"></div>
          <span>Answered</span>
        </span>
        <span className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span>Current</span>
        </span>
      </div>
    </div>
  );
}