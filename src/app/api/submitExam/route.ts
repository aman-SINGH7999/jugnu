import { submitExam } from "@/controllers/testsController";

export async function POST(req: Request) {
  return await submitExam(req);
}
