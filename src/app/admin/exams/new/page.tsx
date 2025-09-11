// app/admin/exams/new/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import QuestionPicker from "@/components/admin/QuestionPicker";
import { Plus } from "lucide-react";

interface Category { _id: string; name: string; }

export default function NewExamPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    duration: 30,
    marksParQue: 4,
    negative: 0,
    questionIds: [] as string[],
  });

  useEffect(() => {
    (async () => {
      try {
        const catRes = await axios.get("/api/categories", { withCredentials: true });
        if (catRes.data?.success) setCategories(catRes.data.data || []);
      } catch (err) {
        console.error("fetch categories:", err);
      }
    })();
  }, []);

  const onQuestionsChange = (ids: string[]) => {
    setForm((f) => ({ ...f, questionIds: ids }));
  };

  const computedTotal = form.marksParQue * form.questionIds.length;

  const handleCreate = async () => {
    if (!form.title.trim()) return alert("Enter title");
    if (!form.categoryId) return alert("Select category");
    if (form.questionIds.length === 0) return alert("Select at least one question");

    try {
      setLoading(true);
      await axios.post(
        "/api/exams",
        {
          title: form.title,
          description: form.description,
          categoryId: form.categoryId,
          duration: Number(form.duration),
          marksParQue: Number(form.marksParQue),
          negative: Number(form.negative),
          questionIds: form.questionIds,
          // ❌ createdBy removed (handled by backend middleware automatically)
        },
        { withCredentials: true }
      );

      router.push("/admin/exams");
    } catch (err) {
      console.error("create exam:", err);
      alert("Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Exam</h1>
        <div className="text-sm text-gray-600">
          Preview total: <span className="font-semibold">{computedTotal}</span> marks
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* main form */}
        <div className="lg:col-span-2 space-y-4">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Exam Title"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full border px-3 py-2 rounded-lg"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Category */}
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Duration */}
            <select
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Select Duration</option>
              {[20, 30, 45, 60, 90, 100, 120, 150, 180].map((d) => (
                <option key={d} value={d}>
                  {d} min
                </option>
              ))}
            </select>

            {/* Marks per question */}
            <select
              value={form.marksParQue}
              onChange={(e) => setForm({ ...form, marksParQue: Number(e.target.value) })}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Marks per Question</option>
              {[1, 2, 4, 5, 8, 10].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Negative Marks */}
          <select
            value={form.negative}
            onChange={(e) => setForm({ ...form, negative: Number(e.target.value) })}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">Negative Marks</option>
            {[-0.25, -0.5, -1, -2, -3].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* Question picker */}
          <div>
            <label className="block mb-2 font-medium">Select Questions</label>
            <QuestionPicker
              value={form.questionIds}
              onChange={onQuestionsChange}
              pageSize={10}
              subjects={categories.find((c) => c._id === form.categoryId)?.subjects || []}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} /> {loading ? "Creating..." : "Create Exam"}
            </button>
            <button
              onClick={() => router.push("/admin/exams")}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* side preview */}
        <aside className="space-y-4">
          <div className="border rounded p-3 bg-gray-50">
            <div className="text-sm text-gray-600">Questions selected</div>
            <div className="text-lg font-semibold mt-2">{form.questionIds.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total marks preview</div>
            <div className="text-xl font-bold">{computedTotal}</div>
          </div>

          <div className="border rounded p-3">
            <div className="text-sm text-gray-600">Quick tips</div>
            <ul className="text-sm mt-2 list-disc pl-5 space-y-1">
              <li>Use search in the picker to find questions quickly.</li>
              <li>You can add many questions — server will recompute total marks.</li>
              <li>For large question banks, add via typeahead (future improvement).</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
