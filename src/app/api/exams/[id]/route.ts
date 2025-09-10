import { getExamById, updateExam, deleteExam } from "@/controllers/examController";

export async function GET(req: Request, context: any) {
  return getExamById(req as any, context);
}

export async function PUT(req: Request, context: any) {
  return updateExam(req as any, context);
}

export async function DELETE(req: Request, context: any) {
  return deleteExam(req as any, context);
}
