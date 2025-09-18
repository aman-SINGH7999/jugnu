import QuizClient from "./QuizClient";

export default function QuizPage({ params }: { params: { subject: string } }) {
  return <QuizClient subject={params.subject} />;
}
