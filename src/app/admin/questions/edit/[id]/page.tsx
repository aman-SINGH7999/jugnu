// app/admin/questions/edit/[id]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import { useEffect, useState } from "react";

const QuestionForm = dynamic(
  () => import("@/components/admin/QuestionForm").then((m) => m.default ?? m),
  {
    ssr: false,
    loading: () => (
      <p className="text-center py-10 text-gray-500">Loading form...</p>
    ),
  }
);

interface EditQuestionPageProps {
  params: { id: string }; // simple object
}


export default function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<any>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const { data } = await axios.get(`/api/questions/${id}`, {
          withCredentials: true,
        });
        if (data.success) setQuestion(data.data);
      } catch (err) {
        console.error("Error fetching question:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    try {
      await axios.put(`/api/questions/${id}`, formData, {
        withCredentials: true,
      });
      router.push("/admin/questions");
    } catch (err) {
      console.error("Error updating question:", err);
      alert("Failed to update question");
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading question...</div>;
  if (!question)
    return <div className="p-6 text-red-500">Question not found</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
      <QuestionForm initialData={question} onSubmit={handleSubmit} />
    </div>
  );
}
