// app/admin/questions/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";

const QuestionForm = dynamic(() => import("@/components/admin/QuestionForm").then((m) => m.default ?? m), {
  ssr: false,
  loading: () => <p className="text-center py-10 text-gray-500">Loading form...</p>,
});

export default function NewQuestionPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await axios.post("/api/questions", data, { withCredentials: true });
      router.push("/admin/questions");
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Failed to add question");
    }
  };

  console.log("QuestionForm:", QuestionForm);
  console.log("typeof QuestionForm:", typeof QuestionForm);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Question</h1>
      <QuestionForm onSubmit={handleSubmit} />
    </div>
  );
}
