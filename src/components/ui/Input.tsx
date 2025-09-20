import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;  // ✅ add this
}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-2 tracking-wider border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...props}
    />
  );
}
