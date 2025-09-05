import React from 'react'

interface inputProps {
    latest : boolean;
}

export default function ResultCard({ latest = false }: inputProps) {
  return (
    <div className="w-full max-w-2xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-green-50 border border-green-200 rounded-xl shadow-sm" >
        {/* Left side - Title */}
        <div className="flex items-center gap-3 text-black font-medium">
            <span>Aptitude Test Result</span>
            {
                latest && <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold py-1 px-2 rounded-full"> NEW </span>
            }
        </div>
        <div className="text-gray-700 font-semibold">567 / 600 Cleared</div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
            View Answer
        </button>
    </div>
  )
}
