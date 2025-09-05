
import BarChartComponent from '@/components/ui/BarChart'
import LineChartComponent from '@/components/ui/LineChart'
import Image from 'next/image'
import React from 'react'

// Dummy user data (will come from backend in real app)
const userData = {
  name: "Amit Kumar",
  username: "ankitji👌",
  totalTests: 24,
  totalPoints: 4850,
  globalRank: 127,
  avatar: "https://via.placeholder.com/100",
}

// Subject & Course Data
const subjects = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Physics" },
  { id: 3, name: "Chemistry" },
  { id: 4, name: "Biology" },
  { id: 5, name: "General Knowledge" },
  { id: 6, name: "Reasoning" },
  { id: 7, name: "Current Affairs" },
  { id: 8, name: "History" },
  { id: 9, name: "Aptitude" },
]

const courses = [
  { course: "JEE", subjectIds: [1, 2, 3] },
  { course: "NEET", subjectIds: [4, 2, 3] },
  { course: "SSC", subjectIds: [5, 6] },
  { course: "UPSC", subjectIds: [5, 7, 8] },
  { course: "Railway", subjectIds: [6, 9] },
]

// Mock test history (in real app, this comes from DB)
const testHistory = [
  { id: 1, subject: "Mathematics", course: "JEE", score: 85, maxScore: 100, date: "2024-04-01", result: "PASS" },
  { id: 2, subject: "Physics", course: "JEE", score: 92, maxScore: 100, date: "2024-04-05", result: "PASS" },
  { id: 3, subject: "Chemistry", course: "NEET", score: 78, maxScore: 100, date: "2024-04-08", result: "PASS" },
  { id: 4, subject: "General Knowledge", course: "SSC", score: 25, maxScore: 100, date: "2024-04-10", result: "FAIL" },
  { id: 5, subject: "Reasoning", course: "Railway", score: 38, maxScore: 40, date: "2024-04-12", result: "PASS" },
  { id: 6, subject: "Current Affairs", course: "UPSC", score: 40, maxScore: 50, date: "2024-04-14", result: "PASS" },
]

export default function page() {
  return (
    <div className="min-h-screen bg-gray-100 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        
        <div className="p-6 space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 rounded-xl shadow-md">
            <div className='flex flex-col md:flex-row md:items-center gap-6'>
              <div className='relative w-25 h-25 rounded-md overflow-hidden'>
                <Image
                  src={'/user-icon.jpeg'}
                  alt="User"
                  fill
                />
              </div>
              <div>
                <div className='text-gray-600 text-4xl font-bold'>{userData.name}</div>
                <div className='text-gray-600 text-xl font-semibold'>{userData.username}</div>
              </div>
            </div>
            <div>
              <div className='text-6xl'>🏅</div>
              <div className='text-green-700'>3 medals</div>
            </div>
          </div>

          {/* Graphical stats */}
          <div className='flex flex-col md:flex-row md:items-center gap-6 md:p-6 rounded-xl shadow-md'>
            <LineChartComponent />
            <BarChartComponent />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Tests" value={userData.totalTests} icon="📝" />
            <StatCard title="Total Points" value={userData.totalPoints} icon="⭐" />
            <StatCard title="Global Rank" value={`#${userData.globalRank}`} icon="🏆" />
            <StatCard title="Courses" value={courses.length} icon="📚" />
          </div>

          {/* Recent Tests */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Tests</h3>
            <div className="space-y-4">
              {testHistory.slice(0, 5).map((test,i) => (
                <div
                  key={test.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
                >
                  <div className='flex gap-4'>
                    <div>
                      <p className="font-medium text-gray-900">{test.subject}</p>
                      <p className="text-sm text-gray-500">via {test.course} • {new Date(test.date).toLocaleDateString()}</p>
                    </div>
                    { i==0 && <div className='bg-gradient-to-r h-6 px-2 rounded-md from-purple-900 to-pink-600'>New</div>}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <button className='bg-green-600 py-1 px-3 rounded-md'>View</button>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        test.result === 'PASS'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {test.result}
                    </span>
                    <span className="text-lg font-bold text-gray-700">
                      {test.score}/{test.maxScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject & Course Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subjects Covered */}
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Subjects Covered</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => {
                  const taken = testHistory.some((t) => t.subject === subject.name)
                  return (
                    <span
                      key={subject.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        taken
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'bg-gray-100 text-gray-500 line-through'
                      }`}
                    >
                      {subject.name}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Courses Enrolled */}
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Courses Enrolled</h3>
              <div className="space-y-3">
                {courses.map((course) => {
                  const subjectsInCourse = subjects.filter((s) =>
                    course.subjectIds.includes(s.id)
                  )
                  const testsInCourse = testHistory.filter((t) => t.course === course.course)
                  const progress = Math.round((testsInCourse.length / subjectsInCourse.length) * 100)

                  return (
                    <div key={course.course} className="border-b pb-2 last:border-b-0">
                      <p className="font-medium text-gray-900">{course.course}</p>
                      <p className="text-sm text-gray-600">
                        {testsInCourse.length} / {subjectsInCourse.length} subjects tested
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Reusable Stat Card Component
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border text-center hover:shadow-md transition">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  )
}