export default function Testimonials() {
  const testimonials = [
    {
      name: "Aman Singh",
      role: "Engineering Aspirant",
      text: "This platform has completely changed how I prepare for exams. Super easy to use and actually makes learning fun.",
      color: "from-purple-400 to-pink-400",
    },
    {
      name: "Priya Sharma",
      role: "Medical Student",
      text: "The progress tracking is amazing. I can clearly see my improvement week after week. Highly recommend!",
      color: "from-blue-400 to-cyan-400",
    },
    {
      name: "Rohit Kumar",
      role: "School Topper",
      text: "Clean and professional design. I enjoy learning here every day — no distractions, just results.",
      color: "from-green-400 to-teal-400",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-300 to-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          What Our Users Say
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Real students, real results. Here’s how we’re helping learners achieve their goals.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden`}
            >
              {/* Gradient Circle */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${t.color} opacity-30`}></div>

              {/* Quote Icon */}
              <div className="text-6xl text-gray-200 mb-4 select-none">“</div>

              {/* Testimonial Text */}
              <p className="text-gray-800 mb-6 leading-relaxed text-lg">{t.text}</p>

              {/* User Info */}
              <div className="flex items-center gap-4 mt-4">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-white font-bold text-lg select-none">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
