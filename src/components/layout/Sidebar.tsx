import { LayoutDashboard, BookOpenCheck, CalendarCheck2, BookCopy, ScrollText, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Tests', icon: BookOpenCheck, href: '/tests' },
    { name: 'Schedule', icon: CalendarCheck2, href: '/schedule' },
    { name: 'Subjects', icon: BookCopy, href: '/subjects' },
    { name: 'Results', icon: ScrollText, href: '/results' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  // mobile only
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // Sirf mobile view (<=768px)
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

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isSidebarOpen, setIsSidebarOpen]);


  return (
    <>
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col z-50
        transition-all duration-300 ease-in-out overflow-hidden
        ${isSidebarOpen ? 'w-64' : 'w-0'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsSidebarOpen(false)}>
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <span className="text-xl font-bold text-yellow-400 text-shadow-[0_2px_2px_rgba(0,0,0,0.9)] tracking-wider">
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
                ${item.href === pathname
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Image
              src="/user-icon.jpeg"
              alt="User"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">User</span>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border"
        aria-label="Toggle Sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </>
  );
};

export default Sidebar;
