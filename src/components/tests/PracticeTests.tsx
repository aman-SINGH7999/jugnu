// components/ScheduledTests.tsx
import { User } from 'lucide-react';
import Link from 'next/link';

const ScheduledTests = () => {
  const tests = [
    { subject: "Physics", title: "Light", duration: "1 hr", status: "done" },
    { subject: "Physics", title: "Kinematics", duration: "30 min", status: "pending" },
    { subject: "Chemistry", title: "Solid State", duration: "1 hr 30 min", status: "pending" },
    { subject: "Mathematics", title: "Algebra", duration: "30 min", status: "done" },
    { subject: "Chemistry", title: "Solid State", duration: "45 min", status: "pending" },
    { subject: "Mathematics", title: "Algebra", duration: "1 hr", status: "pending" },

  ];

  return (
    <div className="py-14">
      <h2 className="text-3xl font-bold text-gray-600 mb-6 border-b border-gray-200">Practice Tests</h2>
      <div className="space-y-3 grid sm:grid-cols-2 gap-5">
        {tests.map((test, index) => (
          <div key={index} className="bg-violet-50 rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 mb-1"><span className='text-gray-600 font-semibold mr-2'>{test.subject}</span>{test.title}</h3>
                <p className="text-sm text-gray-500"><span className=' mr-1'>Duration:</span>{test.duration}</p>
              </div>
            </div>
            {
              test.status === 'done' 
              ? <div className='px-3 py-1 bg-green-700 text-white text-xs rounded-lg'>Completed</div>
              : <Link href={'#'} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 transition-colors">
                  Start
                </Link>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledTests;