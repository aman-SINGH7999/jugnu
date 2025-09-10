import { getAttemptById } from "@/controllers/attemptController";

export async function GET(req: Request, context: any) {
  return getAttemptById(req as any, context);
}
