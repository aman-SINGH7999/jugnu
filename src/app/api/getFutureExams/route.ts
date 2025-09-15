import { getFutureExams } from "@/controllers/testsController";

export async function GET(req: Request) {
  return getFutureExams(req as any);