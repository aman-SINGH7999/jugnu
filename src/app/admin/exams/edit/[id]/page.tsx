"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import QuestionPicker from "@/components/admin/QuestionPicker";
import { Save } from "lucide-react";
import { toDatetimeLocal, localDatetimeToISOString } from "@/utils/datetime";


interface Category { _id: string; name: string; subjects?: any[] }
interface User { _id: string; name?: string; email: string }

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams(); // 👈 Next.js dynamic route param
  const examId = params?.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    duration: 30,
    marksParQue: 4,
    negative: 0,
    questionIds: [] as string[],
    scheduledDate: "",
  });


  // 🔹 Fetch exam details + categories + users
  useEffect(() => {
    (async () => {
      try {
        const [examRes, catRes, userRes] = await Promise.all([
          axios.get(`/api/exams/${examId}`, { withCredentials: true }),
          axios.get("/api/categories", { withCredentials: true }),
          axios.get("/api/users", { withCredentials: true }),
        ]);

        if (catRes.data?.success) setCategories(catRes.data.data || []);
        if (userRes.data?.success) setUsers(userRes.data.data || []);

        if (examRes.data?.success) {
          const exam = examRes.data.data;
          const normalizedQuestionIds = (exam.questionIds || []).map((q: any) => {
            if (!q) return "";
            if (typeof q === "string") return q;
            if (typeof q === "object") return String(q._id ?? q.id ?? q);
            return String(q);
          }).filter(Boolean);
          setForm({
            title: exam.title || "",
            description: exam.description || "",
            categoryId: exam.categoryId || "",
            duration: exam.duration || 30,
            marksParQue: exam.marksParQue || 4,
            negative: exam.negative || 0,
            questionIds: normalizedQuestionIds,
            scheduledDate: exam.scheduledDate ? toDatetimeLocal(exam.scheduledDate) : ""
          });
        }
      } catch (err) {
        console.error("fetch exam data:", err);
        alert("Failed to load exam data");
        router.push("/admin/exams");
      }
    })();
  }, [examId, router]);

  const onQuestionsChange = (ids: string[]) => {
    setForm((f) => ({ ...f, questionIds: ids }));
  };

  const computedTotal = form.marksParQue * form.questionIds.length;

  const handleUpdate = async () => {
    if (!form.title.trim()) return alert("Enter title");
    if (!form.categoryId) return alert("Select category");
    if (form.questionIds.length === 0) return alert("Select at least one question");

    try {
      setLoading(true);

      const payload: any = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        duration: Number(form.duration),
        marksParQue: Number(form.marksParQue),
        negative: Number(form.negative),
        questionIds: form.questionIds,
      };


      if (form.scheduledDate) {
        payload.scheduledDate = localDatetimeToISOString(form.scheduledDate);
      } else {
        payload.scheduledDate = null;
      }

      console.log("update payload:", payload);
      await axios.put(`/api/exams/${examId}`, payload, { withCredentials: true });

      router.push("/admin/exams");
    } catch (err) {
      console.error("update exam:", err);
      alert("Failed to update exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Update Exam</h1>
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
              {[20, 30, 45, 60, 90, 100, 120, 150, 180, 720, 100000].map((d) => (
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
              {[1, 2, 4, 5, 8, 10].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="md:flex justify-between">
            {/* Negative Marks */}
            <select
              value={form.negative}
              onChange={(e) => setForm({ ...form, negative: Number(e.target.value) })}
              className="border px-3 py-2 rounded-lg"
            >
              {[-0.25, -0.5, -1, -2, -3, 0].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

              {/* scheduled Date */}
            <div className="md:flex items-center gap-2">
              <label className="block font-medium text-nowrap">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full"
              />
            </div>
          </div>

          {/* Question picker */}
          <div>
            <label className="block mb-2 font-medium">Select Questions</label>
            <QuestionPicker
              value={form.questionIds}
              onChange={onQuestionsChange}
              pageSize={10}
              subjects={categories.find((c) => c._id === form.categoryId)?.subjects || []}
              users={users}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save size={16} /> {loading ? "Updating..." : "Update Exam"}
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
        </aside>
      </div>
    </div>
  );
}
