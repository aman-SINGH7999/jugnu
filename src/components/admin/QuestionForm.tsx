"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PlusCircle, X, Upload } from "lucide-react";
import axios from "axios";
import Image from "next/image";

const TiptapEditor = dynamic(() => import("./TiptapEditor").then((m) => m.default ?? m), {
  ssr: false,
  loading: () => <div className="p-4 text-gray-500 italic">Loading editor...</div>,
});

interface Subject {
  _id: string;
  name: string;
}

interface OptionItem {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionPayload {
  subjectId: string;
  text: string;
  image?: string;
  options: { optionText: string; isCorrect: boolean }[];
  explanation?: string;
}

interface Props {
  initialData?: QuestionPayload;
  onSubmit: (data: QuestionPayload) => Promise<void>;
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 9);
}

function QuestionForm({ initialData, onSubmit }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState(initialData?.subjectId || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [options, setOptions] = useState<OptionItem[]>(
    initialData?.options
      ? initialData.options.map((o) => ({ id: cryptoRandomId(), optionText: o.optionText, isCorrect: o.isCorrect }))
      : [
          { id: cryptoRandomId(), optionText: "", isCorrect: false },
          { id: cryptoRandomId(), optionText: "", isCorrect: false },
        ]
  );

  const [explanation, setExplanation] = useState(initialData?.explanation || "");
  const [editorHtml, setEditorHtml] = useState<string>(initialData?.text || "");
  const [editorReady, setEditorReady] = useState(false);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await axios.get("/api/subjects", { withCredentials: true });
        if (data?.success) setSubjects(data.data || []);
      } catch (err) {
        console.error("fetchSubjects error:", err);
      }
    };
    fetchSubjects();
  }, []);

  // Option helpers
  const addOption = () => setOptions((s) => [...s, { id: cryptoRandomId(), optionText: "", isCorrect: false }]);
  const removeOption = (id: string) => setOptions((s) => s.filter((o) => o.id !== id));
  const toggleCorrect = (id: string) => setOptions((s) => s.map((o) => (o.id === id ? { ...o, isCorrect: !o.isCorrect } : o)));
  const updateOptionText = (id: string, value: string) => setOptions((s) => s.map((o) => (o.id === id ? { ...o, optionText: value } : o)));

  // Handle upload
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setImage(data.url);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImage("");
    setFile(null);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!subjectId) return alert("Select a subject");
    if (!editorReady) return alert("Editor not ready");
    const text = (editorHtml || "").trim();
    if (!text) return alert("Enter question text");
    if (options.length < 2) return alert("At least two options required");
    if (!options.some((o) => o.isCorrect)) return alert("At least one correct option required");

    const payload: QuestionPayload = {
      subjectId,
      text,
      image,
      options: options.map((o) => ({ optionText: o.optionText, isCorrect: o.isCorrect })),
      explanation,
    };

    await onSubmit(payload);
  };

  // Keep editorHtml in sync if initialData changes (edit mode)
  useEffect(() => {
    setEditorHtml(initialData?.text || "");
  }, [initialData?.text]);

  return (
    // Layout: single column on mobile, wider left column on md+ (left spans 2, right is narrow)
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT COLUMN (wider on desktop) */}
      <div className="space-y-6 md:col-span-2">
        {/* Subject */}
        <div>
          <label className="block mb-1 font-medium">Subject</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Question Text (Tiptap) */}
        <div>
          <label className="block mb-1 font-medium">Question Text</label>
          <div className="border rounded-lg p-3 bg-white">
            <TiptapEditor
              initialContent={initialData?.text || ""}
              onChange={(html) => setEditorHtml(html)}
              onReady={(ed) => setEditorReady(Boolean(ed))}
            />
          </div>
        </div>

        {/* Options */}
        <div>
          <label className="block mb-1 font-medium">Options</label>
          <div className="space-y-2">
            {options.map((o, idx) => (
              <div key={o.id} className="flex flex-col md:flex-row md:items-center gap-2">
                <input type="checkbox" checked={o.isCorrect} onChange={() => toggleCorrect(o.id)} />
                <input
                  type="text"
                  value={o.optionText}
                  onChange={(e) => updateOptionText(o.id, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 border px-3 py-2 rounded-lg"
                />
                <button onClick={() => removeOption(o.id)} className="p-2 hover:bg-gray-100 rounded">
                  <X size={16} />
                </button>
              </div>
            ))}
            <button onClick={addOption} className="inline-flex items-center gap-1 text-blue-600 text-sm">
              <PlusCircle size={16} /> Add option
            </button>
          </div>
        </div>

        {/* Explanation */}
        <div>
          <label className="block mb-1 font-medium">Explanation (optional)</label>
          <textarea rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
        </div>
      </div>

      {/* RIGHT COLUMN (narrow) - only image preview + controls + submit */}
      <aside className="space-y-6 md:sticky md:top-6">
        <div>
          <label className="block mb-1 font-medium">Related Image (optional)</label>

          <div className="flex items-center gap-2 mt-3">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300 flex items-center gap-1">
              <Upload size={16} /> Choose file
            </label>
            <button onClick={handleUpload} disabled={!file || uploading} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {image && (
              <button onClick={removeImage} type="button" className="px-2 py-1 border rounded text-sm hover:bg-gray-100">
                Remove
              </button>
            )}
          </div>

          {/* Image preview (narrow) */}
          {image ? (
            <div className="mt-4 border rounded overflow-hidden w-full relative h-40">
              <Image
                src={image}
                alt="preview"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="mt-4 border rounded h-40 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

        </div>

        {/* Submit / meta panel (compact) */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex flex-col gap-2">
            <button onClick={handleSubmit} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60" disabled={!editorReady}>
              {initialData ? "Update Question" : "Add Question"}
            </button>
            <button onClick={() => {
              // reset
              setSubjectId("");
              setEditorHtml(initialData?.text || "");
              setOptions([
                { id: cryptoRandomId(), optionText: "", isCorrect: false },
                { id: cryptoRandomId(), optionText: "", isCorrect: false },
              ]);
              setExplanation("");
              removeImage();
            }} className="w-full px-4 py-2 border rounded-lg">
              Reset
            </button>
          </div>

          {!editorReady && <p className="mt-2 text-xs text-yellow-600">Editor loading — please wait...</p>}
        </div>

        {/* small help text */}
        <div className="text-xs text-gray-500">
          Tip: on desktop layout the left column is wider and holds the main form; right column is narrow and shows only image preview + controls.
        </div>
      </aside>
    </div>
  );
}

export default QuestionForm;
