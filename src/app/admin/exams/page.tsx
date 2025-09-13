// app/admin/exams/page.tsx
"use client";

import React, { useEffect, useState, KeyboardEvent } from "react";
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}
interface User {
  _id: string;
  name: string;
  email?: string;
}
interface Exam {
  _id: string;
  title: string;
  description?: string;
  categoryId: Category | string;
  duration: number;
  totalMarks: number;
  marksParQue: number;
  negative: number;
  questionIds: string[] | any[];
  createdBy?: User | string;
  createdAt?: string;
}

export default function ExamsListPage(): JSX.Element {
  const router = useRouter();

  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [creators, setCreators] = useState<User[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState<string | "">("");
  const [filterCreatorId, setFilterCreatorId] = useState<string | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);
  const [deleting, setDeleting] = useState(false);

  // fetch metadata
  const fetchMeta = async () => {
    try {
      const [cats, users] = await Promise.all([
        axios.get("/api/categories", { withCredentials: true }).catch(() => ({ data: { success: false } })),
        axios.get("/api/users", { withCredentials: true }).catch(() => ({ data: { success: false } })),
      ]);
      if (cats.data?.success) setCategories(cats.data.data || []);
      if (users.data?.success) setCreators(users.data.data || []);
    } catch (err) {
      console.error("fetchMeta error:", err);
    }
  };

  // fetch exams (with filters, search, pagination)
  const fetchExams = async (opts?: { page?: number }) => {
    try {
      setLoading(true);
      const p = opts?.page ?? page;
      const params: any = { page: p, limit };
      if (filterCategoryId) params.categoryId = filterCategoryId;
      if (filterCreatorId) params.createdBy = filterCreatorId;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const { data } = await axios.get("/api/exams", { params, withCredentials: true });
      if (data?.success) {
        setExams(data.data || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setExams([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("fetchExams error:", err);
      setExams([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  // when filters or searchQuery change => reset to page 1 and fetch
  useEffect(() => {
    setPage(1);
    fetchExams({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategoryId, filterCreatorId, searchQuery]);

  // when page changes
  useEffect(() => {
    fetchExams({ page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const performSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") performSearch();
  };

  const confirmDelete = (ex: Exam) => setDeleteTarget(ex);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/exams/${deleteTarget._id}`, { withCredentials: true });
      setDeleteTarget(null);
      // re-fetch current page (if last item deleted, ensure page bounds)
      fetchExams({ page });
    } catch (err) {
      console.error("delete exam error:", err);
      alert("Failed to delete exam");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Exams</h1>
        <button
          onClick={() => router.push("/admin/exams/new")}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Add Exam</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 w-full md:w-2/3">
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterCreatorId}
            onChange={(e) => setFilterCreatorId(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All creators</option>
            {creators.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} {u.email ? `(${u.email})` : ""}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-24 py-2 border rounded-lg"
            />
            <button
              onClick={performSearch}
              className="absolute right-1 top-1 bottom-1 px-3 py-1 bg-blue-600 text-white rounded-lg"
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

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="w-full overflow-x-auto min-w-0">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Creator</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Questions</th>
                <th className="p-3">Total Marks</th>
                <th className="p-3">Scheduled Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    Loading exams...
                  </td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No exams found
                  </td>
                </tr>
              ) : (
                exams.map((ex) => (
                  <tr key={ex._id} className="border-t align-top">
                    <td className="p-3 max-w-[350px]">
                      <div className="font-medium">{ex.title}</div>
                      {ex.description && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{ex.description}</div>}
                    </td>
                    <td className="p-3">{typeof ex.categoryId === "string" ? ex.categoryId : (ex.categoryId as Category).name}</td>
                    <td className="p-3 text-sm">
                      {ex.createdBy ? (typeof ex.createdBy === "string" ? ex.createdBy : (ex.createdBy as User).name) : "—"}
                    </td>
                    <td className="p-3">{ex.duration} min</td>
                    <td className="p-3">{Array.isArray(ex.questionIds) ? ex.questionIds.length : (ex as any).questionCount ?? 0}</td>
                    <td className="p-3">{ex.totalMarks}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {ex.scheduledDate ? new Date(ex.scheduledDate).toLocaleString() : "—"} {/* ✅ Render date */}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => router.push(`/admin/exams/edit/${ex._id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`Edit exam ${ex.title}`}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(ex)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Delete exam ${ex.title}`}
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

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm delete</h3>
            <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete the exam <span className="font-medium">"{deleteTarget.title}"</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg bg-red-600 text-white">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
