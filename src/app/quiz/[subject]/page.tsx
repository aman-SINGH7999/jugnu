import QuizClient from "./QuizClient";

export default function QuizPage({ params }: any) {
  return <QuizClient subject={params.subject} />;
}
