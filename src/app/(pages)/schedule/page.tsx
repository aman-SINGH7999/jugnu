"use client";

import Header from "@/components/tests/Header";
import TestCardNew from "@/components/tests/TestCardNew";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CardLoader } from "@/components/layout/Loader";

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
  scheduledDate?: string;
}

export default function Page() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");

  // fetch categories for filter
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

  // ✅ fetch all exams ek hi baar (no categoryId in request)
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getFutureExams");
        setExams(res.data.data || []);
      } catch (error) {
        console.error("Error fetching exams", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // 🔎 local filters (search + category)
  const filteredExams = useMemo(() => {
    let result = exams;

    // category filter
    if (categoryId) {
      result = result.filter((exam) => exam.categoryId?._id === categoryId);
    }

    // search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.description?.toLowerCase().includes(query) ||
          exam.categoryId?.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [search, categoryId, exams]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden text-gray-900">
        <Header heading="Current Test" />

        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Search tests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 text-gray-700"
            />
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
          </div>

          {/* Exam grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {loading ? (
              <>
                <CardLoader />
                <CardLoader />
                <CardLoader />
                <CardLoader />
                <CardLoader />
                <CardLoader />
              </>
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
