import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features2 from "@/components/home/Features2";
import Testimonials from "@/components/home/Testimonials";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1">
        <Hero />
        <div className="relative">
          <Features2 />
          <Testimonials />
          <div className="absolute inset-0 flex justify-center items-center opacity-[3%] pointer-events-none">
            <Image
              src="/logo.png"
              alt="Logo"
              width={1000}
              height={1000}
              className="max-w-[80%] h-auto"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
