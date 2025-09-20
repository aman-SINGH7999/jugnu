'use client'

import React, { useEffect, useState } from 'react'
import { Clock, Calendar, Award, Users, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TestCardProps {
  exam?: {
    _id: string;
    title: string;
    description?: string;
    categoryId: {
      _id: string;
      name: string;
    }
    duration: number;
    totalMarks: number;
    marksParQue: number;
    negative: number;
    questionIds: string[];
    scheduledDate?: string;
    createdAt: string;
    attempted?: boolean; // ✅ add this
  }
  bgColor?: string;
  onActionClick: () => void;
}

export default function TestCard({ exam, bgColor, onActionClick }: TestCardProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState('')

  // Mock exam (fallback)
  const mockExam = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Mathematics Practice Test',
    description: 'Comprehensive test covering algebra, geometry, and calculus.',
    categoryId: { _id: '507f1f77bcf86cd799439012', name: 'Mathematics' },
    duration: 120,
    totalMarks: 100,
    marksParQue: 4,
    negative: -1,
    questionIds: Array.from({ length: 25 }, (_, i) => (i + 1).toString()),
    scheduledDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    createdAt: new Date().toISOString()
  }

  const testData = exam || mockExam

  // timings
  const startTime = testData.scheduledDate ? new Date(testData.scheduledDate).getTime() : null
  const endTime = startTime ? startTime + testData.duration * 60 * 1000 : null
  const now = new Date().getTime()

  const isUpcoming = startTime ? now < startTime : false
  const isOngoing = startTime && endTime ? now >= startTime && now <= endTime : false
  const isExpired = endTime ? now > endTime : false

  // Format date + time
  const formatDateTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Countdown for upcoming tests
  useEffect(() => {
    if (!isUpcoming || !startTime) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = startTime - now

      if (diff <= 0) {
        setTimeLeft('')
        clearInterval(interval)
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, isUpcoming])

  return (
    <div
      className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between border border-blue-100 hover:border-blue-400 hover:-translate-y-0"
      style={{ backgroundColor: bgColor || 'white' }}
    >
      {/* Content */}
      <div className="relative z-10 px-6 py-3 flex flex-col gap-4">
        {/* Title + Category */}
        <div className='border-b border-blue-500'>
          <h2 className="text-2xl font-bold text-blue-800 group-hover:text-blue-600 transition-colors">
            {testData.title}
          </h2>
          <p className="text-sm font-medium text-blue-800">{testData.categoryId.name}</p>
        </div>

        {/* Description */}
        {/* {testData.description && (
          <p className="text-gray-600 text-sm line-clamp-2">{testData.description}</p>
        )} */}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
            <Clock size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{testData.duration} mins</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
            <Award size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{testData.totalMarks} pts</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
            <Users size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{testData.questionIds.length} Qs</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
            <Target size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              +{testData.marksParQue} / -{Math.abs(testData.negative)}
            </span>
          </div>
        </div>

        {/* Date / Countdown */}
        {testData.scheduledDate && (
          <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
            <Calendar size={16} className='text-blue-500' />
            {isUpcoming && (
              <>
                Starts at {formatDateTime(testData.scheduledDate)}
                {timeLeft && <span className="ml-2 text-gray-500 font-medium">({timeLeft})</span>}
              </>
            )}
            {isOngoing && <>Ongoing (ends {formatDateTime(new Date(endTime!).toISOString())})</>}
            {isExpired && <>Expired</>}
          </div>
        )}

        {/* Button */}
        <button
            onClick={onActionClick}
            disabled={!isOngoing || testData.attempted} // ✅ add attempted
            className={`w-full py-3 mt-3 rounded-lg text-sm font-semibold transition-all ${
              testData.attempted
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isUpcoming
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isOngoing
                ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-md'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {testData.attempted
              ? 'Already Attempted'
              : isUpcoming
              ? 'Coming Soon'
              : isOngoing
              ? 'Start Test'
              : 'Expired'}
          </button>

      </div>
    </div>
  )
}
