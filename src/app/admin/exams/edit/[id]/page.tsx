// app/admin/exams/edit/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import QuestionPicker from "@/components/admin/QuestionPicker";

interface Category { _id: string; name: string; }
interface Question { _id: string; text: string; }
interface ExamData {
  _id: string;
  title: string;
  description?: string;
  categoryId: Category | string;
  duration: number;
  marksParQue: number;
  negative: number;
  questionIds: string[] | Question[];
}

export default function EditExamPage(): JSX.Element {
  const router = useRouter();
  const params = useParams() as { id: string };
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
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
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const [catRes, examRes] = await Promise.all([
          axios.get("/api/categories", { withCredentials: true }),
          axios.get(`/api/exams/${id}`, { withCredentials: true }),
        ]);
        if (catRes.data?.success) setCategories(catRes.data.data || []);
        if (examRes.data?.success) {
          const e = examRes.data.data as ExamData;
          setForm({
            title: (e.title || ""),
            description: (e.description || ""),
            categoryId: typeof e.categoryId === "string" ? e.categoryId : (e.categoryId as Category)._id,
            duration: e.duration || 30,
            marksParQue: e.marksParQue || 4,
            negative: e.negative || 0,
            questionIds: Array.isArray(e.questionIds) ? (e.questionIds as any[]).map((q) => (typeof q === "string" ? q : q._id)) : [],
          });
        }
      } catch (err) {
        console.error("load exam:", err);
        alert("Failed to load exam");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onQuestionsChange = (ids: string[]) => setForm((f) => ({ ...f, questionIds: ids }));

  const computedTotal = form.marksParQue * form.questionIds.length;

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/exams/${id}`, {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        duration: Number(form.duration),
        marksParQue: Number(form.marksParQue),
        negative: Number(form.negative),
        questionIds: form.questionIds,
      }, { withCredentials: true });
      router.push("/admin/exams");
    } catch (err) {
      console.error("update exam:", err);
      alert("Failed to update exam");
    }
  };

  if (!id) return <div className="p-6">Invalid exam id</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Exam</h1>
        <div className="text-sm text-gray-600">Preview total: <span className="font-semibold">{computedTotal}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Exam Title" className="w-full border px-3 py-2 rounded-lg" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className="w-full border px-3 py-2 rounded-lg" rows={4} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="border px-3 py-2 rounded-lg">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            <input type="number" min={1} value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} className="border px-3 py-2 rounded-lg" placeholder="Duration (min)" />

            <input type="number" min={0} value={form.marksParQue} onChange={(e) => setForm({ ...form, marksParQue: Number(e.target.value) })} className="border px-3 py-2 rounded-lg" placeholder="Marks per question" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input type="number" value={form.negative} onChange={(e) => setForm({ ...form, negative: Number(e.target.value) })} className="border px-3 py-2 rounded-lg" placeholder="Negative marks (per wrong)" />
            <div className="flex items-center gap-2">
              <button onClick={() => { setForm({ ...form, questionIds: [] }); }} className="px-3 py-2 border rounded">Clear selection</button>
              <div className="text-sm text-gray-600">Selected: {form.questionIds.length}</div>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Select Questions</label>
            <QuestionPicker value={form.questionIds} onChange={onQuestionsChange} pageSize={10} />
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save changes</button>
            <button onClick={() => router.push("/admin/exams")} className="px-4 py-2 border rounded-lg">Cancel</button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border rounded p-3 bg-gray-50">
            <div className="text-sm text-gray-600">Questions selected</div>
            <div className="text-lg font-semibold mt-2">{form.questionIds.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total marks preview</div>
            <div className="text-xl font-bold">{computedTotal}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
