import React from 'react'
import Card from '../ui/Card'

export default function NewNotification() {
  return (
    <div className='animate-new'>
        <Card className="bg-pink-500/20 ">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 py-1 px-3 rounded-md text-shadow-[0_3px_3px_rgb(0_0_0_/_0.9)] italic">New</span>
            <div className="text-shadow-[0_3px_3px_rgb(0_0_0_/_0.9)] tracking-wider ">Weekly test is available now!</div>
          </div>
          
        </Card>
        <style jsx>
            {`
              @keyframes notify{
                0% { transform: rotate(0deg); }
                8% { transform: rotate(3deg); }
                16% { transform: rotate(-3deg); }
                24% { transform: rotate(3deg); }
                33% { transform: rotate(0deg); }
                100% { transform: rotate(0deg); }
              }
              
              .animate-new{
                animation : notify 4s linear infinite;
              }
            `}
        </style>
    </div>
  )
}
