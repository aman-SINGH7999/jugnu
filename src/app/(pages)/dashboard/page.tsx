"use client";

import BarChartComponent from '@/components/ui/BarChart'
import LineChartComponent from '@/components/ui/LineChart'
import Image from 'next/image'
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';


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


export interface ICategory {
  _id: string;
  name: string;
}

export interface ISubject {
  _id: string;
  name: string;
}

export interface ISubjectScore {
  subjectId: ISubject; // ✅ populated Subject object
  marks: number;
}
export interface IAttempts {
  exam: string;
  score: number;
  createdAt: Date;
}

export interface IUserAchievement {
  attempts: IAttempts[];
  expertise: ICategory[];
  rating: number;
  medals: number;
  subjectsScore: ISubjectScore[];
  createdAt: string;
  updatedAt: string;
}

interface IExams {
  category : string;
  examId: string;
  examTitle: string;
  totalScore: number;
}
export interface IPublishedResult {
  exams : IExams[];
}

export interface IAchievementResponse {
  success: boolean;
  data?: IUserAchievement;
  message?: string;
}

export default function page() {
  const [userAchievements, setUserAchievements] = useState<IUserAchievement | null>(null);
  const [publishedResult, setPublishedResult] = useState<IPublishedResult | []>([])
  const [loading, setLoading] = useState<boolean>(true); 
  const { user } = useAuth();
  const router = useRouter();

  console.log("user: ",user)


  const fetchUserData = async () => {
    if (!user?._id && !user?.id) return; // ✅ user null hua to return kar do

    try {
      const { data } = await axios.get(`/api/achievements/${user.id}`);
      console.log("data: ", data);
      setUserAchievements(data.data);
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedResult = async ()=>{
    if (!user?._id && !user?.id) return; // ✅ user null hua to return kar do

    try {
      const { data } = await axios.get(`/api/publishedResult/user/${user.id}/all`);
      console.log("Published result: ", data);
      setPublishedResult(data?.exams || []);
    } catch (err) {
      console.log("Error: ", err);
    } 
  }
useEffect(() => {
  
  fetchUserData();
  fetchPublishedResult();

}, [user]); // ✅ dependency me user daalna zaroori hai


  return (
    <div className="min-h-screen bg-gray-100 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        
        <div className="p-6 space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 rounded-xl shadow-md">
            <div className='flex flex-col md:flex-row md:items-center gap-6'>
              <div className='relative w-25 h-25 rounded-md overflow-hidden'>
                <Image
                  src={user?.image ? user.image : '/user-icon.jpeg'}
                  alt="User"
                  fill
                />
              </div>
              <div>
                <div className='text-gray-600 text-4xl font-bold'>{user?.name}</div>
                <div className='text-gray-600 text-xl font-semibold'>{user?.email}</div>
              </div>
            </div>
            <div className='flex items-centeri justify-center'>
              <div className='text-green-700 text-3xl'>{userAchievements?.medals ? userAchievements.medals : 0}</div>
              <div className='text-6xl'>🏅</div>
            </div>
          </div>

          {/* Graphical stats */}
          <div className='flex flex-col md:flex-row md:items-center gap-6 md:p-6 rounded-xl shadow-md'>
            <LineChartComponent data={userAchievements?.attempts}  />
            <BarChartComponent data={userAchievements?.subjectsScore} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Tests" value={userAchievements?.expertise ? userAchievements.expertise.length : 0} icon="📝" />
            <StatCard title="Total Points" value={userAchievements?.rating ? userAchievements.rating : 0} icon="⭐" />
            <StatCard title="Global Rank" value={`#${userAchievements?.rank ? userAchievements.rank : "N/A"}`} icon="🏆" />
            <StatCard title="Courses" value={userAchievements?.subjectsScore ? userAchievements.subjectsScore.length : 0} icon="📚" />
          </div>

          {/* Recent Tests */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Tests</h3>
            <div className="space-y-4">
              {publishedResult.length > 0 && publishedResult.map((result,i) => (
                <div
                  key={result.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
                >
                  <div className='flex gap-4'>
                    <div>
                      <p className="font-medium text-gray-900">{result.category}</p>
                      <p className="text-sm text-gray-500">via {result.examTitle} </p>
                      {/* • {new Date(result.date).toLocaleDateString()} */}
                    </div>
                    { i==0 && <div className='bg-gradient-to-r h-6 px-2 rounded-md from-purple-900 to-pink-600'>New</div>}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <button onClick={()=> router.push(`/tests/${result.examId}/result`)} className='bg-green-600 py-1 px-3 rounded-md'>View</button>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        result.totalScore > 40
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {result.totalScore > 40 ? "PASS" : "FAIL"}
                    </span>
                    <span className="text-lg font-bold text-gray-700">
                      {result.totalScore}/100
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