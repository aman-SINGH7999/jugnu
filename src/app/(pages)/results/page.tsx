import CircleChart from '@/components/ui/CircleChart'
import LineChart from '@/components/ui/LineChart'
import BarChart from '@/components/ui/BarChart'
import React from 'react'
import Header from '@/components/tests/Header'
import ResultCard from '@/components/results/ResultCard'
import Image from 'next/image'
import TopRankers from '@/components/results/TopRankers'
import CourseAnalysis from '@/components/results/CourseAnalysis'



export default function ResultPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col-reverse md:flex-row items-star justify-around p-6 border-b">
          <ResultCard latest={true} />
          <div className='text-5xl font-bold text-gray-500 text-shadow-[0_2px_2px_rgba(0,0,0,0.9)]'>Results</div>
        </div>

        
        <CourseAnalysis />
        

        {/* list sections */}
      <div className='flex flex-col md:flex-row md:justify-between'>
        <div className='w-full'>
          <div className='text-2xl text-gray-600 font-bold px-10'>Previous Results</div>
          <div className="flex flex-col p-6 gap-2">
            <ResultCard key={1} latest={true} />
            <ResultCard key={2} />
            <ResultCard key={3} />
            <ResultCard key={4} />
          </div>
        </div>
        <TopRankers />
      </div>
      </div>
    </div>
  )
}

