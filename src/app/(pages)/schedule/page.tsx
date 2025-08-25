'use client'

import Header from '@/components/tests/Header'
import PracticeTests from '@/components/tests/PracticeTests'
import ScheduleCard from '@/components/tests/ScheduleCard'
import TestCard from '@/components/tests/TestCard'
import { Atom, Calculator, FileText, FlaskConical } from 'lucide-react'
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
            <ScheduleCard
                title="Chemistry Mock Test"
                type="Mock Test"
                subjectIcon={<FlaskConical className="w-8 h-8 text-purple-600" />}
                description="Organic + Inorganic mix questions"
                date="28 Aug 2025"
                startTime="10:00 AM"
                endTime="11:30 AM"
                duration={90}
                badgeColor="purple"
            />
            <ScheduleCard
                title="Mathematics Aptitude"
                type="Practice Test"
                subjectIcon={<Calculator className="w-8 h-8 text-blue-600" />}
                description="Algebra & Probability focus"
                date="29 Aug 2025"
                startTime="02:00 PM"
                endTime="03:00 PM"
                duration={60}
                badgeColor="blue"
            />

            <ScheduleCard
                title="Physics Full Syllabus"
                type="Final Test"
                description="Complete syllabus revision test"
                date="30 Aug 2025"
                startTime="09:00 AM"
                endTime="12:00 PM"
                duration={180}
                badgeColor="green"
            />
            <ScheduleCard
                title="Chemistry Mock Test"
                type="Mock Test"
                subjectIcon={<FlaskConical className="w-8 h-8 text-purple-600" />}
                description="Organic + Inorganic mix questions"
                date="28 Aug 2025"
                startTime="10:00 AM"
                endTime="11:30 AM"
                duration={90}
                badgeColor="purple"
            />
            <ScheduleCard
                title="Mathematics Aptitude"
                type="Practice Test"
                subjectIcon={<Calculator className="w-8 h-8 text-blue-600" />}
                description="Algebra & Probability focus"
                date="29 Aug 2025"
                startTime="02:00 PM"
                endTime="03:00 PM"
                duration={60}
                badgeColor="blue"
            />

            <ScheduleCard
                title="Physics Full Syllabus"
                type="Final Test"
                description="Complete syllabus revision test"
                date="30 Aug 2025"
                startTime="09:00 AM"
                endTime="12:00 PM"
                duration={180}
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
