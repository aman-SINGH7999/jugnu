// app/admin/questions/page.tsx  (or wherever your QuestionsPage is)
"use client";

import React, { useEffect, useState, KeyboardEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ----- Types -----
interface Subject {
  _id: string;
  name: string;
}

interface QuestionItem {
  _id: string;
  subjectId: Subject | string;
  text: string;
  image?: string;
  options: { optionText: string; isCorrect: boolean }[];
  explanation?: string;
  createdAt?: string;
}

export default function QuestionsPage(): JSX.Element {
  const router = useRouter();

  // data
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // loading / UI
  const [loading, setLoading] = useState(false);
  const [filterSubjectId, setFilterSubjectId] = useState<string | "">("");
  const [searchInput, setSearchInput] = useState<string>(""); // bound to input
  const [searchQuery, setSearchQuery] = useState<string>(""); // used for fetch

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // delete state
  const [deleteTarget, setDeleteTarget] = useState<QuestionItem | null>(null);

  // ----- Fetch subjects -----
  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get("/api/subjects", { withCredentials: true });
      if (data?.success) setSubjects(data.data || []);
    } catch (err) {
      console.error("fetchSubjects error:", err);
    }
  };

  // ----- Fetch questions -----
  const fetchQuestions = async (opts?: { page?: number }) => {
    try {
      setLoading(true);
      const params: any = { page: opts?.page ?? page, limit };
      if (filterSubjectId) params.subjectId = filterSubjectId;
      if (searchQuery?.trim()) params.search = searchQuery.trim();

      const { data } = await axios.get("/api/questions", {
        params,
        withCredentials: true,
      });

      if (data?.success) {
        setQuestions(data.data || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setQuestions([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("fetchQuestions error:", err);
      setQuestions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // When subject filter or searchQuery changes => reset page & fetch
  useEffect(() => {
    setPage(1);
    fetchQuestions({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSubjectId, searchQuery]);

  // page change
  useEffect(() => {
    fetchQuestions({ page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ----- Delete -----
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/questions/${deleteTarget._id}`, {
        withCredentials: true,
      });
      setDeleteTarget(null);
      fetchQuestions({ page });
    } catch (err) {
      console.error("delete error:", err);
      alert("Failed to delete question");
    }
  };

  // perform search (called on button click or Enter)
  const performSearch = () => {
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  // ----- Render -----
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Questions</h1>
        <button
          onClick={() => router.push("/admin/questions/new")}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Add Question</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <select
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search questions..."
              className="w-full pl-10 pr-24 py-2 border rounded-lg"
            />
            <button
              onClick={performSearch}
              className="absolute right-1 top-1 bottom-1 px-3 py-1 bg-blue-600 text-white rounded-lg"
              aria-label="Search"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Page {page} / {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-md border hover:bg-gray-50"
            disabled={page <= 1}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-md border hover:bg-gray-50"
            disabled={page >= totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="bg-white shadow-md rounded-lg">
        {/* Make sure wrapper allows horizontal scroll on small screens */}
        <div className="w-full overflow-x-auto min-w-0">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Question</th>
                <th className="p-3">Image</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Options</th>
                <th className="p-3">Explanation</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Loading questions...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No questions found
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q._id} className="border-t align-top">
                    <td className="p-3 max-w-[400px]">
                      <div
                        className="prose max-w-none text-sm font-medium"
                        dangerouslySetInnerHTML={{ __html: q.text }}
                      />
                    </td>
                    <td className="p-3">
                      {q.image ? (
                        // next/image is fine, but ensure domain allowed in next config
                        <Image
                          src={q.image}
                          alt="question"
                          width={128}
                          height={80}
                          className="mt-2 w-32 h-20 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-3 text-sm">
                      {typeof q.subjectId === "string"
                        ? q.subjectId
                        : (q.subjectId as Subject).name}
                    </td>
                    <td className="p-3 text-sm">
                      <ul className="list-disc pl-5">
                        {q.options.map((o, idx) => (
                          <li
                            key={idx}
                            className={
                              o.isCorrect
                                ? "font-semibold text-green-600"
                                : "text-gray-700"
                            }
                          >
                            {o.optionText}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-xs text-gray-500 max-w-[200px]">
                      {q.explanation ? q.explanation : "N/A"}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/questions/edit/${q._id}`)
                          }
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`Edit question ${q._id}`}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(q)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Delete question ${q._id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this question?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
