'use client';
import Image from "next/image";

export default function QuestionCard({ question, selected = [], onSelect }: any) {
  if (!question) return <div className="p-6">No question</div>;

  const opts = question.options || [];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
      <div className="prose prose-blue max-w-none">
        {question.text ? (
          <div dangerouslySetInnerHTML={{ __html: question.text }} />
        ) : <p>No content</p>}

        {question.image && (
          <div className="mt-4">
            <Image
              src={question.image}
              alt="Question Illustration"
              width={400}
              height={250}
              className="rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {opts.map((opt: any, i: number) => {
          const isSelected = Array.isArray(selected) && selected.includes(i);
          const content = typeof opt === "string" ? opt : (opt.optionText ?? "");
          return (
            <div
              key={i}
              onClick={() => onSelect(i)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition shadow-sm
                ${isSelected ? "bg-blue-100 shadow-inner" : "hover:bg-gray-100"}`}
            >
              <div
                className={`w-5 h-5 rounded-md flex-shrink-0 border-2 
                  ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"}`}
              />
              <div className="flex-1">
                <span dangerouslySetInnerHTML={{ __html: String(content) }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
