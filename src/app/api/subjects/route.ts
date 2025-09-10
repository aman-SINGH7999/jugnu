import { createSubject, getSubjects } from "@/controllers/subjectController";

export async function POST(req: Request) {
  return createSubject(req);
}

export async function GET() {
  return getSubjects();
}
