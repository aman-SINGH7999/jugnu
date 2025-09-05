"use client";

import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { useState } from 'react';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out w-full min-h-screen
        ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {children}
        <Footer />
      </main>
    </div>
  );
}
