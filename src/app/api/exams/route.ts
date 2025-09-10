import { createExam, getExams } from "@/controllers/examController";

export async function GET(req: Request) {
  return getExams(req as any);
}

export async function POST(req: Request) {
  return createExam(req as any);
}
