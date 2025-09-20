"use client";

import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/admin/Sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(()=>{
    if(user?.role !== 'teacher' && user?.role !== 'admin') router.push('/');
  },[])

  useEffect(() => {
    if (!loading) {
      // not logged in -> send to login
      if (!user) {
        router.replace("/auth/admin-login"); // or "/admin/login" if that's your path
        return;
      }

      // allow only admin OR teacher
      if (user.role !== "admin" && user.role !== "teacher") {
        router.replace("/403");
        return;
      }
    }
  }, [user, loading, router]);

  console.log("user: ", user)

  // while auth is being resolved, show a minimal loading state to avoid UI flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // if not loading and user is null, useEffect will already redirect — but return nothing or loading UI
  if (!user) return null;

  return (
    <div className="flex overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out w-full min-h-screen bg-white text-black min-w-0
        ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {children}
        <Footer />
      </main>
    </div>
  );
}
