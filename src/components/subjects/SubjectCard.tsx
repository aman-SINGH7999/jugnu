import React from 'react'
import { BookOpen , BookOpenText   } from 'lucide-react';
import Card from '../ui/Card';

interface SubjectProp {
    subjectName: string
}

const colors: string[] = [
  "bg-blue-50",
  "bg-green-50",
  "bg-yellow-50",
  "bg-red-50",
  "bg-pink-50",
  "bg-gray-50",
  "bg-purple-50",
  "bg-indigo-50",
  "bg-orange-50",
  "bg-teal-50",
];


export default function SubjectCard({subjectName}:SubjectProp ) {
  return (
    <Card className={`relative flex flex-col gap-8 justify-center items-center h-96 border overflow-hidden ${colors[Math.ceil(Math.random()*10)]}`}>
        <div className='relative text-gray-700'>
            <BookOpenText size={60} className='stroke-1' />
            <BookOpen className='absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-1' size={70} />
        </div>
        <div className='text-xl text-gray-600'>Learn Sharper</div>
        <div className='text-3xl font-bold text-gray-600 text-shadow-[0_2px_2px_rgba(0,0,0,0.7)]'>{subjectName}</div>
        <button className='py-2 px-5 outline-1 text-white text-lg z-10 bg-green-400 rounded-md'>Explore Now</button>

        <div className='absolute bg-blue-300/30 h-32 w-52 rotate-45 -top-25 left-0'></div>
        <div className='absolute bg-green-300/30 h-20 w-52 rotate-45 top-0 -left-35'></div>
        <div className='absolute bg-yellow-300/30 h-52 w-52 rotate-45 -bottom-30 -right-30'></div>
        <div className='absolute bg-blue-300/30 h-32 w-32 rotate-45 -bottom-25 right-30'></div>
        <div className='absolute bg-red-300/30 h-32 w-32 rotate-45 -bottom-25 right-50'></div>
        <div className='absolute bg-green-300/30 h-20 w-52 rotate-45 bottom-10 -right-35'></div>
    </Card>
  )
}
