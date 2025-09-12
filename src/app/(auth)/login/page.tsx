"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import MoveJugnu from "@/components/animation/MoveJugnu";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";


export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();
      const { user } = useAuth()
    
      useEffect(()=>{
        if(user) router.push('/dashboard');
      })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("form submit:")
    
    e.preventDefault();
    setErrorMsg(null);

    // client-side quick validation
    if ( !form.email || !form.password) {
      setErrorMsg("Please fill all fields");
      return;
    }
    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    console.log(form)
    try {
      setLoading(true);
      console.log("hiiiii")
      const res = await axios.post("/api/auth/login", 
        { email: form.email, password: form.password },
        { withCredentials: true },
      );
      console.log("hi")
      const data = res.data;

      if (data.error) {
        // show server error message if available
        setErrorMsg(data?.message || "Login failed");
        setLoading(false);
        return;
      }
      console.log("login successfully")
      router.push("/dashboard");
    } catch (err:any) {
      console.error("Login request failed:", err);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-3 sm:p-0">
      {/* Background Image */}
      <Image
        src="/login-bg.png"
        alt="Login Background"
        fill
        className="object-cover -z-10"
        priority
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 text-white">
        {/* Logo + App Name */}
        <div className="flex flex-col items-center mb-6">
          <Link href={'/'}><Image src="/logo.png" alt="App Logo" width={60} height={60} /></Link>
          <h1 className="mt-2 text-2xl font-bold tracking-wide">My Virtual School</h1>
          <p className="text-gray-300 text-sm mt-1">Welcome back! Please login</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button className="absolute top-3 right-2 text-gray-300" onClick={()=>setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1 text-gray-400">
              <input type="checkbox" className="p-1" />
              <div>Remember me</div>
            </div>
            <Link href={'#'} className="text-blue-400">Forget Password</Link>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Login..." : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-400/40"></div>
          <span className="px-3 text-sm text-gray-300">OR</span>
          <div className="flex-1 h-px bg-gray-400/40"></div>
        </div>

        {/* Social Login */}
        <div className="flex gap-4">
          <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} variant="outline" className="w-1/2 flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-100">
            <FcGoogle className="text-xl" /> Google
          </Button>
          <Button onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })} variant="outline" className="w-1/2 flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-100">
            <FaFacebook className="text-xl" /> Facebook
          </Button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-300 mt-6 text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* animation of jugnu */}
      <MoveJugnu x1={300} y1={200} x2={150} y2={250} x3={0} y3={300} size={30} time={30} />
      <MoveJugnu x1={500} y1={100} x2={200} y2={400} x3={220} y3={100} size={25} time={40} />
      <MoveJugnu x1={-700} y1={-200} x2={-400} y2={-100} x3={-500} y3={200} size={35} time={50} />
      <MoveJugnu x1={500} y1={400} x2={350} y2={450} x3={0} y3={100} size={30} time={30} />
      </div>
  );
}
