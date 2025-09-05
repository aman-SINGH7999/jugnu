"use client";

import { useState } from "react";
import CircleChart from "@/components/ui/CircleChart";
import BarChart from "@/components/ui/BarChart";

const courses = ["JEE", "NEET", "SSC", "Banking"];

export default function CourseAnalysis() {
  const [activeCourse, setActiveCourse] = useState("JEE");

  return (
    <div className="p-6">
      {/* Heading */}
      <div className="mx-6">
        <h2 className="text-gray-700 text-xl font-semibold">
            Analysis according to courses
        </h2>

        {/* Course buttons */}
        <div className="flex gap-3 flex-wrap mb-2">
            {courses.map((course) => (
            <button
                key={course}
                onClick={() => setActiveCourse(course)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                activeCourse === course
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
            >
                {course}
            </button>
            ))}
        </div>
      </div>

      {/* Analysis Section */}
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Circle Chart */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">
            Overall Performance ({activeCourse})
          </h3>
          <CircleChart />
        </div>

        {/* Bar Chart */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">
            Subject-wise Scores ({activeCourse})
          </h3>
          <BarChart />
        </div>
      </div>
    </div>
  );
}
