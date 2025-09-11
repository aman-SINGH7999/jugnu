"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import  Modal from "@/components/ui/Modal"; // 🔹 Global reusable Modal imported
import axios from "axios";

// 🔹 Subject type
interface Subject {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [form, setForm] = useState({ name: "", description: "" });

// 🔹 Fetch all subjects
const fetchSubjects = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get("/api/subjects", {withCredentials:true});
    if (data.success) setSubjects(data.data);
  } catch (err) {
    console.error("Error fetching subjects:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchSubjects();
}, []);

// 🔹 Handle Add / Update
const handleSave = async () => {
  try {
    if (modalType === "add") {
      await axios.post("/api/subjects", form, {withCredentials:true});
    } else if (modalType === "edit" && selectedSubject) {
      await axios.put(`/api/subjects/${selectedSubject._id}`, form, {withCredentials:true});
    }
    setForm({ name: "", description: "" });
    setModalType(null);
    fetchSubjects();
  } catch (err) {
    console.error("Error saving subject:", err);
  }
};

// 🔹 Handle Delete
const handleDelete = async () => {
  try {
    if (selectedSubject) {
      await axios.delete(`/api/subjects/${selectedSubject._id}`, {withCredentials:true});
    }
    setModalType(null);
    fetchSubjects();
  } catch (err) {
    console.error("Error deleting subject:", err);
  }
};

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <button
          onClick={() => setModalType("add")}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredSubjects.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  No subjects found
                </td>
              </tr>
            ) : (
              filteredSubjects.map((subject) => (
                <tr key={subject._id} className="border-t">
                  <td className="p-3 font-medium">{subject.name}</td>
                  <td className="p-3 text-gray-600">{subject?.description ? subject?.description : "N/A"}</td>
                  <td className="p-3 flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedSubject(subject);
                        setForm({
                          name: subject.name,
                          description: subject.description || "",
                        });
                        setModalType("edit");
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSubject(subject);
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

      {/* Modal - Add / Edit */}
      <Modal
        isOpen={modalType === "add" || modalType === "edit"}
        onClose={() => setModalType(null)}
        title={modalType === "add" ? "Add Subject" : "Edit Subject"}
        backdrop={false} // 🔹 Disable dark background overlay
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {modalType === "add" ? "Add" : "Update"}
          </button>
        </div>
      </Modal>

      {/* Modal - Delete */}
      <Modal
        isOpen={modalType === "delete"}
        onClose={() => setModalType(null)}
        title="Confirm Delete"
        backdrop={false} // 🔹 Disable dark background overlay
      >
        <p className="mb-4">
          Are you sure you want to delete "{selectedSubject?.name}"?
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