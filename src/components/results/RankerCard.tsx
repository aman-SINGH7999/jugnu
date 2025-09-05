import Image from "next/image";
import { Star } from "lucide-react";

export default function RankerCard({
  rank,
  name,
  rating,
  image,
}: {
  rank: number;
  name: string;
  rating: number;
  image: string;
}) {
  // Top 3 ke liye alag colors
  const rankColors = [
    "bg-yellow-400 text-white", // 1st
    "bg-gray-400 text-white",   // 2nd
    "bg-orange-500 text-white", // 3rd
  ];

  const rankClass =
    rank <= 3
      ? rankColors[rank - 1]
      : "bg-blue-100 text-blue-600";

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition">
      {/* Rank Number */}
      <div
        className={`w-9 h-9 flex items-center justify-center font-bold rounded-full ${rankClass}`}
      >
        {rank}
      </div>

      {/* Profile Image */}
      <Image
        src={image}
        alt={name}
        width={48}
        height={48}
        className="rounded-full border shadow-sm"
      />

      {/* Name + Rating */}
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{name}</span>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          {rating.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
