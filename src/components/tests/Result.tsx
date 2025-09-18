export default function Result({ score, total }: { score: number; total: number }) {
  return (
    <div className="p-6 bg-green-50 border rounded-lg text-center">
      <h2 className="text-2xl font-bold">Your Result</h2>
      <p className="mt-4 text-lg">
        Score: <span className="font-semibold">{score}</span> / {total}
      </p>
      <p className="text-gray-600 mt-2">
        Percentage: {((score / total) * 100).toFixed(2)}%
      </p>
    </div>
  );
}
