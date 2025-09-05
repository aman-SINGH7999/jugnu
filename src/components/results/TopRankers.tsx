import RankerCard from "./RankerCard";

const rankers = [
  { id: 1, name: "Nitin Shukla", rating: 18321, image: "/user-icon.jpeg" },
  { id: 2, name: "Aman Singh", rating: 16210, image: "/user-icon.jpeg" },
  { id: 3, name: "Priya Verma", rating: 15980, image: "/user-icon.jpeg" },
  { id: 4, name: "Rohit Kumar", rating: 14500, image: "/user-icon.jpeg" },
  { id: 5, name: "Sneha Gupta", rating: 13200, image: "/user-icon.jpeg" },
];

export default function TopRankers() {
  return (
    <div className="flex flex-col p-6 gap-4 bg-gray-50 rounded-2xl shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800">🏆 Top Rankers</h2>

      <div className="flex flex-col gap-3">
        {rankers.map((ranker, index) => (
          <RankerCard
            key={ranker.id}
            rank={index + 1}
            name={ranker.name}
            rating={ranker.rating}
            image={ranker.image}
          />
        ))}
      </div>
    </div>
  );
}
