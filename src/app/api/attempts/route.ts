import { createAttempt, getAttempts } from "@/controllers/attemptController";

export async function GET(req: Request) {
  return getAttempts(req as any);
}

export async function POST(req: Request) {
  return createAttempt(req as any);
}
