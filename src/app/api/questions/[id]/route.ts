//questions/[id]/route.ts

import {
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "@/controllers/questionController";

export async function GET(req: Request, context: any) {
  return getQuestionById(req as any, context);
}

export async function PUT(req: Request, context: any) {
  return updateQuestion(req as any, context);
}

export async function DELETE(req: Request, context: any) {
  return deleteQuestion(req as any, context);
}
