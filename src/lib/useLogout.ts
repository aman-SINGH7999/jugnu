"use client";
import axios from "axios";
import { useAuth } from "@/lib/useAuth";

export function useLogout() {
  const { refresh } = useAuth(); // user state ko refresh ya clear karne ke liye

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      // ✅ refresh auth state
      refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return logout;
}
