'use client'

import Header from '@/components/tests/Header'
import PracticeTests from '@/components/tests/PracticeTests'
import TestCard from '@/components/tests/TestCard'
import { Atom, FileText } from 'lucide-react'
import React from 'react'

export default function page() {

  const handleStartTest = () => {
    alert("Test started!");
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <Header heading='Current Test' />
        <div className="p-6">
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
            <TestCard
              title="Mathematics Aptitude Test"
              type="Aptitude"
              description="This is a timed assessment"
              startTime="10:00 AM"
              endTime="11:00 AM"
              totalDuration={60}
              remainingMinutes={60}
              onActionClick={handleStartTest}
              actionLabel="Start"
              badgeColor="blue"
            />
            <TestCard
              title="Physics Midterm Exam"
              type="Exam"
              subjectIcon={<Atom className="w-8 h-8 text-purple-600" />}
              description="Chapter 1-5 covered"
              startTime="2:00 PM"
              endTime="4:00 PM"
              totalDuration={120}
              remainingMinutes={110}
              onActionClick={handleStartTest}
              actionLabel="Resume"
              badgeColor="purple"
            />
            <TestCard
              title="English Essay Practice"
              type="Practice"
              subjectIcon={<FileText className="w-8 h-8 text-green-600" />}
              description="Write a 500-word essay"
              startTime="6:00 PM"
              endTime="7:30 PM"
              totalDuration={90}
              remainingMinutes={85}
              onActionClick={handleStartTest}
              actionLabel="Continue"
              badgeColor="green"
            />
            <TestCard
              title="Mathematics Aptitude Test"
              type="Aptitude"
              description="This is a timed assessment"
              startTime="10:00 AM"
              endTime="11:00 AM"
              totalDuration={60}
              remainingMinutes={60}
              onActionClick={handleStartTest}
              actionLabel="Start"
              badgeColor="blue"
            />
            <TestCard
              title="Physics Midterm Exam"
              type="Exam"
              subjectIcon={<Atom className="w-8 h-8 text-purple-600" />}
              description="Chapter 1-5 covered"
              startTime="2:00 PM"
              endTime="4:00 PM"
              totalDuration={120}
              remainingMinutes={110}
              onActionClick={handleStartTest}
              actionLabel="Resume"
              badgeColor="purple"
            />
            <TestCard
              title="English Essay Practice"
              type="Practice"
              subjectIcon={<FileText className="w-8 h-8 text-green-600" />}
              description="Write a 500-word essay"
              startTime="6:00 PM"
              endTime="7:30 PM"
              totalDuration={90}
              remainingMinutes={85}
              onActionClick={handleStartTest}
              actionLabel="Continue"
              badgeColor="green"
            />
          </div>
          
          {/* PracticeTests */}
          <PracticeTests />
          
        </div>
      </div>
    </div>
  )
}
