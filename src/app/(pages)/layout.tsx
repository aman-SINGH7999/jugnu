"use client";

import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { useState } from 'react';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='overflow-x-hidden flex'>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="w-full">
        {children}
        <Footer />
      </main>
    </div>
  );
}

