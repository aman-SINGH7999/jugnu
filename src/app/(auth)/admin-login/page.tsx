// app/admin-login/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/lib/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth()

  useEffect(()=>{
    if(user) router.push('/admin/exams');
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/auth/adminLogin",
        { email, password },
        { withCredentials: true } // 👈 important
      );

      const data = res.data;

      
      // Success: server sets httpOnly cookie. Use returned role to redirect.
      const role: string =
        data?.user?.role || (data?.token ? parseRoleFromToken(data.token) : "admin");

      console.log("data: ")

      console.log(data)

      if (role === "admin") {
        router.push("/admin/exams");
      } else if (role === "teacher") {
        router.push("/admin/exams");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError(err?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper: decode JWT payload (optional, only if server sends token in response)
  function parseRoleFromToken(token?: string) {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      const json = JSON.parse(atob(payload));
      return json.role;
    } catch {
      return null;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-gray-800">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Admin / Teacher Login
        </h1>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-2 rounded">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded p-2 text-gray-800"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded p-2  text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
