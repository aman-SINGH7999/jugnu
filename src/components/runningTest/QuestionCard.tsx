'use client';
import Image from "next/image";

export default function QuestionCard({ question, selected, onSelect }: any) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
      {/* Question Statement */}
      <div className="prose prose-blue max-w-none">
        {question.text ? (
  <div
    className="prose"
    dangerouslySetInnerHTML={{ __html: question.text }}
  />
) : (
  <p>No content</p>
)}

        {/* Agar image diya gaya hai */}
        {question.image && (
          <div className="mt-4">
            <Image
              src={question.image}
              alt="Question Illustration"
              width={500}
              height={300}
              className="rounded-lg border shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt: any, i: number) => (
          <button
            key={i}
            onClick={() => onSelect(opt)}
            className={`block w-full text-left px-4 py-3 rounded-lg border transition ${
              selected === opt
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {/* Option me bhi HTML/Markdown ho sakta hai */}
            {typeof opt === "string" ? (
              opt
            ) : (
              <span dangerouslySetInnerHTML={{ __html: opt }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
