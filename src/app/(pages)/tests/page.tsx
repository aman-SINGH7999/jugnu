"use client";

import Header from "@/components/tests/Header";
import TestCardNew from "@/components/tests/TestCardNew";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
}

interface Exam {
  _id: string;
  title: string;
  description?: string;
  categoryId: { _id: string; name: string };
  duration: number;
  totalMarks: number;
  marksParQue: number;
  negative: number;
  questionIds: string[];
  createdAt: string;
  scheduledDate: string; // exam ki date
  attempted: boolean; // ✅ add this
}

export default function Page() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [categoryId, setCategoryId] = useState("");
  const [dayFilter, setDayFilter] = useState("all");

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ fetch exams (all at once, no category filter in API)
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getUpcomingSoonExams");
        setExams(res.data.data || []);
      } catch (error) {
        console.error("Error fetching exams", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // ✅ local filters (category + today/tomorrow/day-after)
  const filteredExams = useMemo(() => {
    let result = exams;

    // category filter
    if (categoryId) {
      result = result.filter((exam) => exam.categoryId?._id === categoryId);
    }

    // date filters
    if (dayFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const targetDate = new Date(today);
      if (dayFilter === "tomorrow") {
        targetDate.setDate(today.getDate() + 1);
      } else if (dayFilter === "dayafter") {
        targetDate.setDate(today.getDate() + 2);
      }

      result = result.filter((exam) => {
        const examDate = new Date(exam.scheduledDate);
        examDate.setHours(0, 0, 0, 0);

        if (dayFilter === "today") {
          return examDate.getTime() === today.getTime();
        }
        return examDate.getTime() === targetDate.getTime();
      });
    }

    return result;
  }, [dayFilter, categoryId, exams]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden text-gray-900">
        <Header heading="Current Test" />

        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="dayafter">Day After Tomorrow</option>
            </select>
          </div>

          {/* Exam grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {loading ? (
              <p className="col-span-full text-center text-gray-500">Loading...</p>
            ) : filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <TestCardNew
                  key={exam._id}
                  exam={exam}
                  onActionClick={() =>
                    router.push(`/tests/${exam._id}/instructions`)
                  }
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No tests available at the moment
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
