import { getSubjectById, updateSubject, deleteSubject } from "@/controllers/subjectController";

export async function GET(_: Request, { params }: any) {
  return getSubjectById(params.id);
}

export async function PUT(req: Request, { params }: any) {
  return updateSubject(params.id, req);
}

export async function DELETE(_: Request, { params }: any) {
  return deleteSubject(params.id);
}
