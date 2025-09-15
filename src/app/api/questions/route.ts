//questions/route.ts
import { createQuestion, getQuestions } from "@/controllers/questionController";

export async function GET(req: Request) {
  return getQuestions(req as any);
}

export async function POST(req: Request) {
  return createQuestion(req as any);
}
