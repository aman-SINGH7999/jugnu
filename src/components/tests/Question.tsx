interface QuestionProps {
  q: {
    question: string;
    options: string[];
    answer: string;
  };
  index: number;
  selected: string | null;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function Question({ q, index, selected, onSelect, disabled }: QuestionProps) {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-3">
        {index + 1}. {q.question}
      </h3>
      <div className="space-y-2">
        {q.options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={`q-${index}`}
              value={opt}
              checked={selected === opt}
              onChange={() => onSelect(opt)}
              disabled={disabled}
              className="w-4 h-4 text-blue-600"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
