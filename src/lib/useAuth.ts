// lib/useAuth.ts
"use client";
import { useEffect, useState, useCallback } from "react";

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  image?: string;
  provider: "nextauth" | "custom";
} | null;

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me", { cache: "no-store", credentials: "include" });
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, refresh: fetchUser };
}
