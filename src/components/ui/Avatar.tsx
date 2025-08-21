import React from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ src, alt = "User", size = "md" }: AvatarProps) {
  const sizes = {
    sm: 32, // w-8 h-8
    md: 48, // w-12 h-12
    lg: 80, // w-20 h-20
  };

  const dimension = sizes[size];

  return (
    <div
      className={`rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
      style={{ width: dimension, height: dimension }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={dimension}
          height={dimension}
          className="object-cover"
        />
      ) : (
        <span className="text-gray-500 text-sm font-medium">
          {alt[0]}
        </span>
      )}
    </div>
  );
}
