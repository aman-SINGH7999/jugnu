"use client";

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar'

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
