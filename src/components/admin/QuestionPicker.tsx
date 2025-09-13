"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export interface PickedQuestion { _id: string; text: string; }
interface Subject { _id: string; name: string; }
interface User { _id: string; name?: string; email: string; }

interface Props {
  value?: any[]; // can be string[] or object[] — we'll normalize
  onChange?: (ids: string[]) => void;
  pageSize?: number;
  placeholder?: string;
  subjects?: Subject[];
  users?: User[];
}

export default function QuestionPicker({
  value = [],
  onChange,
  pageSize = 10,
  placeholder = "Search questions...",
  subjects = [],
  users = [],
}: Props) {
  // helper to normalize any id-like value to string
  const toId = (v: any) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") {
      if ("_id" in v && v._id != null) return String(v._id);
      if ("id" in v && v.id != null) return String(v.id);
    }
    return String(v);
  };

  const [selected, setSelected] = useState<string[]>(
    (value || []).map(toId).filter(Boolean)
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<PickedQuestion[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // filters
  const [subjectId, setSubjectId] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<string>("");

  // keep local selected in sync when parent value changes (normalize)
  useEffect(() => {
    setSelected((value || []).map(toId).filter(Boolean));
  }, [value]);

  useEffect(() => {
    fetchQuestions({ page, search, subjectId, createdBy });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, subjectId, createdBy]);

  const fetchQuestions = async (opts?: { page?: number; search?: string; subjectId?: string; createdBy?: string }) => {
    try {
      setLoading(true);
      const p = opts?.page ?? page;
      const q = opts?.search ?? search;
      const s = opts?.subjectId ?? subjectId;
      const u = opts?.createdBy ?? createdBy;

      const { data } = await axios.get("/api/questions", {
        params: { page: p, limit: pageSize, search: q, subjectId: s || undefined, createdBy: u || undefined },
        withCredentials: true,
      });

      if (data?.success) {
        // normalize returned _id to string so comparison is consistent
        const items = (data.data || []).map((it: any) => ({ ...it, _id: String(it._id) }));
        setResults(items);
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
    fetchQuestions({ page: 1, search, subjectId, createdBy });
  };

  const toggle = (id: string, checked: boolean) => {
    const next = checked ? [...selected, id] : selected.filter((s) => s !== id);
    setSelected(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-3">
      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Subject Filter */}
        <select
          value={subjectId}
          onChange={(e) => { setSubjectId(e.target.value); setPage(1); }}
          className="border px-3 py-2 rounded-lg flex-1"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        {/* User Filter */}
        <select
          value={createdBy}
          onChange={(e) => { setCreatedBy(e.target.value); setPage(1); }}
          className="border px-3 py-2 rounded-lg flex-1"
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name || u.email}
            </option>
          ))}
        </select>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 items-center">
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
        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading...</div>
        ) : results.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No questions</div>
        ) : (
          <div className="max-h-56 overflow-y-auto p-2">
            {results.map((r) => {
              const rid = String(r._id);
              const checked = selected.includes(rid);
              return (
                <label key={rid} className="flex gap-2 items-start p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggle(rid, e.target.checked)}
                    className="mt-1"
                  />
                  <div className="text-sm break-words" dangerouslySetInnerHTML={{ __html: r.text }} />
                </label>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="p-2 flex items-center justify-between border-t bg-white">
          <div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => page > 1 && setPage((p) => p - 1)} disabled={page <= 1} className="p-1 border rounded"><ChevronLeft size={16} /></button>
            <button onClick={() => page < totalPages && setPage((p) => p + 1)} disabled={page >= totalPages} className="p-1 border rounded"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
