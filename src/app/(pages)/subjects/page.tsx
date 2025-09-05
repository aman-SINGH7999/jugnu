'use client'
import SubjectCard from "@/components/subjects/SubjectCard";
import Header from "@/components/tests/Header";
import { useState } from "react";

const courses = [
  { course: "ALL", subjectIds: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  { course: "JEE", subjectIds: [1, 2, 3] },
  { course: "NEET", subjectIds: [4, 2, 3] },
  { course: "SSC", subjectIds: [5, 6] },
  { course: "UPSC", subjectIds: [5, 7, 8] },
  { course: "Railway", subjectIds: [6, 9] },
];

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
];

export default function Page() {
  const [active, setActive] = useState("JEE");

  // Get active course subjects
  const activeCourse = courses.find(c => c.course === active);
  const filteredSubjects = subjects.filter(s =>
    activeCourse?.subjectIds.includes(s.id)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <Header heading="Choose Your Career" />
        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-3 mb-6 pb-3 border-b">
            {courses.map((cat) => (
              <button
                key={cat.course}
                onClick={() => setActive(cat.course)}
                className={`px-4 py-2 border rounded-md text-sm font-semibold transition-all ${
                  active === cat.course
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat.course}
              </button>
            ))}
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredSubjects.map((subject, i) => (
              <SubjectCard key={subject.id} subjectName={subject.name}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
