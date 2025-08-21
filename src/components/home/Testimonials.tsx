export default function Testimonials() {
  const testimonials = [
    {
      name: "Aman Singh",
      text: "This platform has completely changed how I prepare for exams. Super easy to use!",
    },
    {
      name: "Priya Sharma",
      text: "The progress tracking is amazing. I can clearly see my improvement.",
    },
    {
      name: "Rohit Kumar",
      text: "Clean and professional design, I enjoy learning here every day.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-xl shadow">
              <p className="text-gray-700 italic mb-4">“{t.text}”</p>
              <h4 className="font-semibold">{t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
