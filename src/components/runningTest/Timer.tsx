'use client';
import { useEffect, useState } from 'react';

export default function Timer({ duration, onTimeUp }: { duration: number, onTimeUp: () => void }) {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="px-4 py-1 bg-gray-100 rounded-lg font-mono text-lg font-semibold text-gray-800">
      ⏰ {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
