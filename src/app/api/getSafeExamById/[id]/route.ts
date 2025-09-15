//api/getSafeExamById/[id]/route.ts
import { getSafeExamById } from "@/controllers/testsController";

export async function GET(req: Request, context: any) {
  return await getSafeExamById(req, context);
}
