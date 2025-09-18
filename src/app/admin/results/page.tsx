"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal"; // 🔹 Global reusable Modal
import axios from "axios";

// 🔹 Result type
interface Result {
  _id: string;
  examId: { _id: string; title: string; totalMarks: number };
  publish?: string;
  createdAt?: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  const [publishDate, setPublishDate] = useState("");

  // 🔹 Fetch all results
  const fetchResults = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/results", { withCredentials: true });
      if (data.success) setResults(data.data);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // 🔹 Handle Update Publish Date
  const handleSave = async () => {
    try {
      if (modalType === "edit" && selectedResult) {
        await axios.put(
          `/api/results/${selectedResult._id}`,
          { publish: publishDate },
          { withCredentials: true }
        );
      }
      setPublishDate("");
      setModalType(null);
      fetchResults();
    } catch (err) {
      console.error("Error saving result:", err);
    }
  };

  // 🔹 Handle Delete
  const handleDelete = async () => {
    try {
      if (selectedResult) {
        await axios.delete(`/api/results/${selectedResult._id}`, { withCredentials: true });
      }
      setModalType(null);
      fetchResults();
    } catch (err) {
      console.error("Error deleting result:", err);
    }
  };

  const filteredResults = results.filter((r) =>
    r.examId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Results</h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search results by exam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Exam</th>
              <th className="p-3">Total Marks</th>
              <th className="p-3">Publish Date</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredResults.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No results found
                </td>
              </tr>
            ) : (
              filteredResults.map((result) => (
                <tr key={result._id} className="border-t">
                  <td className="p-3 font-medium">{result.examId?.title}</td>
                  <td className="p-3">{result.examId?.totalMarks}</td>
                  <td className="p-3 text-gray-600">
                    {result.publish
                      ? new Date(result.publish).toLocaleDateString()
                      : "Not Published"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {result.createdAt
                      ? new Date(result.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3 flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedResult(result);
                        setPublishDate(
                          result.publish
                            ? new Date(result.publish).toISOString().slice(0, 10)
                            : ""
                        );
                        setModalType("edit");
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedResult(result);
                        setModalType("delete");
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Edit Publish Date */}
      <Modal
        isOpen={modalType === "edit"}
        onClose={() => setModalType(null)}
        title="Update Publish Date"
        backdrop={false}
      >
        <div className="space-y-4">
          <input
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </Modal>

      {/* Modal - Delete */}
      <Modal
        isOpen={modalType === "delete"}
        onClose={() => setModalType(null)}
        title="Confirm Delete"
        backdrop={false}
      >
        <p className="mb-4">
          Are you sure you want to delete result for exam "
          {selectedResult?.examId?.title}"?
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => setModalType(null)}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
