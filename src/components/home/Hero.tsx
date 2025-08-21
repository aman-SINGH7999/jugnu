import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center bg-gradient-to-r from-blue-600 to-green-500 text-white">
      <div className="max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Master Your Knowledge</h1>
        <p className="text-lg md:text-xl mb-8">
          Take interactive tests, track your progress, and achieve your learning goals.
        </p>
        <Link
          href="/tests"
          className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500"
        >
          Start a Test
        </Link>
      </div>
    </section>
  );
}
