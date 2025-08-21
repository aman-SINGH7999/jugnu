import Image from "next/image";
import React, { useEffect, useState } from "react";

interface MoveJugnuProps {
  size?: number;
  time?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x3?: number;
  y3?: number;
}

export default function MoveJugnu({
  size = 30,
  time = 20,
  x1 = 100,
  y1 = 100,
  x2 = 300,
  y2 = 200,
  x3 = 500,
  y3 = 400,
}: MoveJugnuProps) {
  return (
    <div
      className="absolute animate-moveAround"
      style={{
        ["--x1" as any]: `${x1}px`,
        ["--y1" as any]: `${y1}px`,
        ["--x2" as any]: `${x2}px`,
        ["--y2" as any]: `${y2}px`,
        ["--x3" as any]: `${x3}px`,
        ["--y3" as any]: `${y3}px`,
        ["--time" as any]: `${time}s`,
      }}
    >
      <Image src="/logo.png" alt="Jugnu" width={size} height={size} />
      <div className="absolute top-[15px] left-[11px] h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_10px_3px_rgba(251,191,36,0.7)] animate-glow"></div>

      <style jsx>{`
        @keyframes moveAround {
          0%   { transform: translate(var(--x1), var(--y1)); }
          33%  { transform: translate(var(--x2), var(--y2)); }
          66%  { transform: translate(var(--x3), var(--y3)); }
          100% { transform: translate(var(--x1), var(--y1)); }
        }

        .animate-moveAround {
          animation: moveAround var(--time) ease-in-out infinite;
          will-change: transform;
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.3;
            box-shadow: 0 0 5px 2px rgba(251,191,36,0.4);
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 20px 6px rgba(251,191,36,0.9);
            transform: scale(1.2);
          }
        }

        .animate-glow {
          animation: glow 1.8s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
