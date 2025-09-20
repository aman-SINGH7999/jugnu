"use client"

// components/Header.tsx
import Image from "next/image";
import { useAuth } from "@/lib/useAuth";

interface HeaderProb {
  heading: string;
}

const Header = ({ heading }: HeaderProb) => {
  const { user } = useAuth();

  // 🔹 Email se initials nikaalne ka helper
  const getInitials = (email?: string) => {
    if (!email) return "U"; // Default "U" for Unknown
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
      <h1 className="text-4xl font-bold text-gray-600 text-shadow-[0_2px_1px_rgba(0,0,0,0.5)]">
        <div dangerouslySetInnerHTML={{ __html: heading }} />
      </h1>

      {user?.image ? (
        <Image
          src={user.image}
          alt="User"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-400 text-white font-semibold">
          {getInitials(user?.email)}
        </div>
      )}
    </header>
  );
};

export default Header;
