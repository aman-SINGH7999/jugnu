export default function Features() {
  const features = [
    {
      title: "Interactive Tests",
      desc: "Engaging and challenging tests across multiple subjects.",
    },
    {
      title: "Track Your Progress",
      desc: "Detailed analytics and performance insights over time.",
    },
    {
      title: "Learn Anytime",
      desc: "Access tests and materials anywhere, anytime on any device.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
