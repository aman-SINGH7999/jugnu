import { getUpcomingSoonExams } from "@/controllers/testsController";

export async function GET(req: Request) {
  return getUpcomingSoonExams(req as any);