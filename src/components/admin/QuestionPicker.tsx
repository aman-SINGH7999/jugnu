// QuestionPicker.tsx (replace your component with this)
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export interface PickedQuestion { _id: string; text: string; }
interface Subject { _id: string; name: string; }

interface Props {
  value?: string[];
  onChange?: (ids: string[]) => void;
  pageSize?: number;
  placeholder?: string;
  subjects: Subject[]; // parent passes subjects (may be empty)
}

export default function QuestionPicker({
  value = [],
  onChange,
  pageSize = 10,
  placeholder = "Search questions...",
  subjects = [],
}: Props) {
  const [selected, setSelected] = useState<string[]>(value || []);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<PickedQuestion[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // default subject -> pick first subject automatically when subjects prop changes
  const [activeSubject, setActiveSubject] = useState<string>("");

  useEffect(() => {
    setSelected(value || []);
  }, [value]);

  // when subjects prop changes, default to first subject (if any)
  useEffect(() => {
    if (subjects.length > 0 && !subjects.find(s => s._id === activeSubject)) {
      setActiveSubject(subjects[0]._id);
      setPage(1);
    }
    if (subjects.length === 0) {
      setActiveSubject("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects]);

  useEffect(() => {
    // always allow fetching even if no subject; subjectId is optional
    fetchQuestions({ page, search, subjectId: activeSubject || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // when switching subject, fetch page 1
  useEffect(() => {
    setPage(1);
    fetchQuestions({ page: 1, search, subjectId: activeSubject || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubject]);

  const fetchQuestions = async (opts?: { page?: number; search?: string; subjectId?: string }) => {
    try {
      setLoading(true);
      const p = opts?.page ?? page;
      const q = opts?.search ?? search;
      const s = opts?.subjectId;

      const { data } = await axios.get("/api/questions", {
        params: { page: p, limit: pageSize, search: q, subjectId: s },
        withCredentials: true,
      });

      if (data?.success) {
        setResults(data.data || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setResults([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("QuestionPicker.fetchQuestions:", err);
      setResults([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = () => {
    setPage(1);
    fetchQuestions({ page: 1, search, subjectId: activeSubject || undefined });
  };

  const toggle = (id: string, checked: boolean) => {
    const next = checked ? [...selected, id] : selected.filter((s) => s !== id);
    setSelected(next);
    onChange?.(next);
  };

  const selectAllPage = () => {
    const ids = results.map((r) => r._id);
    const next = Array.from(new Set([...selected, ...ids]));
    setSelected(next);
    onChange?.(next);
  };
  const clearAllPage = () => {
    const ids = results.map((r) => r._id);
    const next = selected.filter((s) => !ids.includes(s));
    setSelected(next);
    onChange?.(next);
  };

  return (
    <div>
      {/* Subject Tabs (if any) */}
      {subjects.length > 0 ? (
        <div className="flex gap-2 mb-3 flex-wrap">
          {subjects.map((s) => (
            <button
              key={s._id}
              onClick={() => { setActiveSubject(s._id); setPage(1); }}
              className={`px-3 py-1 rounded-lg border text-sm ${
                activeSubject === s._id ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-3 text-sm text-gray-500">No subjects in selected category — showing all questions</div>
      )}

      <div className="flex gap-2 items-center mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            className="w-full pl-10 pr-24 py-2 border rounded-lg"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
          />
          <button
            onClick={onSearch}
            className="absolute right-1 top-1 bottom-1 px-3 py-1 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>
        </div>
        <div className="text-sm text-gray-600">Selected: {selected.length}</div>
      </div>

      {/* Results */}
      <div className="border rounded overflow-hidden">
        <div className="p-2 border-b flex items-center justify-between bg-gray-50">
          <div className="text-sm">Results</div>
          <div className="flex items-center gap-2">
            <button onClick={selectAllPage} className="px-2 py-1 text-xs border rounded">Select page</button>
            <button onClick={clearAllPage} className="px-2 py-1 text-xs border rounded">Clear page</button>
          </div>
        </div>

        <div className="max-h-56 overflow-y-auto p-2">
          {loading ? (
            <div className="text-center text-gray-500 py-6">Loading...</div>
          ) : results.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No questions</div>
          ) : (
            results.map((r) => {
              const checked = selected.includes(r._id);
              return (
                <label key={r._id} className="flex gap-2 items-start p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={checked} onChange={(e) => toggle(r._id, e.target.checked)} className="mt-1" />
                  <div className="text-sm break-words" dangerouslySetInnerHTML={{ __html: r.text }} />
                </label>
              );
            })
          )}
        </div>

        <div className="p-2 flex items-center justify-between border-t bg-white">
          <div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => { if (page > 1) setPage((p) => p - 1); }} disabled={page <= 1} className="p-1 border rounded"><ChevronLeft size={16} /></button>
            <button onClick={() => { if (page < totalPages) setPage((p) => p + 1); }} disabled={page >= totalPages} className="p-1 border rounded"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
