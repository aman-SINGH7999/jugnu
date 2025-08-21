import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
