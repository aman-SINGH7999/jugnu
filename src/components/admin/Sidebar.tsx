"use client";

import {
  User,
  BookCopy,
  Layers,
  FileText,
  HelpCircle,
  LogOut,
  Menu, 
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useAuth } from "@/lib/useAuth";
import { useLogout } from "@/lib/useLogout";


interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, loading, refresh } = useAuth();
  const logout = useLogout();
  const router = useRouter();


  const menuItems = [
    { name: "Profile", icon: User, href: "/admin/profile" },
    { name: "Subjects", icon: BookCopy, href: "/admin/subjects" },
    { name: "Questions", icon: HelpCircle, href: "/admin/questions" },
    { name: "Category", icon: Layers, href: "/admin/category" },
    { name: "Exams", icon: FileText, href: "/admin/exams" },
    { name: "Results", icon: FileText, href: "/admin/results" },
  ];

  // mobile only
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 768) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target as Node) &&
          isSidebarOpen
        ) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);



   const handleLogout = async () => {
    try {
      await logout(); // logout kare
      router.push("/admin-login"); // apna custom redirect
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col z-50
        transition-all duration-300 ease-in-out overflow-hidden
        ${isSidebarOpen ? "w-64" : "w-0"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <span className="text-xl font-bold text-yellow-400 tracking-wider">
              <span className="text-green-400">JUG</span>NU
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium
                ${
                  item.href === pathname
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>

        {/* User Profile (Footer) */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Image
              src={user?.image? user.image :"/user-icon.jpeg"}
              alt="User"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">{user?.name ? user?.name : "Admin"}</span>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>
    </>
  );
};

export default Sidebar;
