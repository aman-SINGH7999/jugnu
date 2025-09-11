"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import axios from "axios";

interface Subject {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  subjects: { _id: string; name: string }[];
  createdAt?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [form, setForm] = useState({ name: "", subjects: [] as string[] });

  // 🔹 Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/categories", {
        withCredentials: true,
      });
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch all subjects (for checkbox list)
  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get("/api/subjects", {
        withCredentials: true,
      });
      if (data.success) setSubjects(data.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubjects();
  }, []);

  // 🔹 Handle Add / Update
  const handleSave = async () => {
    try {
      if (modalType === "add") {
        await axios.post("/api/categories", form, { withCredentials: true });
      } else if (modalType === "edit" && selectedCategory) {
        await axios.put(`/api/categories/${selectedCategory._id}`, form, {
          withCredentials: true,
        });
      }
      setForm({ name: "", subjects: [] });
      setModalType(null);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  // 🔹 Handle Delete
  const handleDelete = async () => {
    try {
      if (selectedCategory) {
        await axios.delete(`/api/categories/${selectedCategory._id}`, {
          withCredentials: true,
        });
      }
      setModalType(null);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => {
            setForm({ name: "", subjects: [] });
            setModalType("add");
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search categories..."
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
              <th className="p-3">Subjects</th>
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
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  No categories found
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category._id} className="border-t">
                  <td className="p-3 font-medium">{category.name}</td>
                  <td className="p-3 text-gray-600">
                    {category.subjects && category.subjects.length > 0
                      ? category.subjects.map((s) => s.name).join(", ")
                      : "No subjects"}
                  </td>
                  <td className="p-3 flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setForm({
                          name: category.name,
                          subjects: category.subjects.map((s) => s._id),
                        });
                        setModalType("edit");
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
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
        title={modalType === "add" ? "Add Category" : "Edit Category"}
        backdrop={false}
      >
        <div className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />

          {/* Subjects Checkbox List */}
          <div>
            <label className="block mb-2 font-medium">Subjects</label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-lg p-3">
              {subjects.map((subj) => (
                <label key={subj._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.subjects.includes(subj._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({
                          ...form,
                          subjects: [...form.subjects, subj._id],
                        });
                      } else {
                        setForm({
                          ...form,
                          subjects: form.subjects.filter(
                            (id) => id !== subj._id
                          ),
                        });
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <span>{subj.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
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
        backdrop={false}
      >
        <p className="mb-4">
          Are you sure you want to delete "{selectedCategory?.name}"?
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
