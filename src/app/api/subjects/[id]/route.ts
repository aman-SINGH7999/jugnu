import { getSubjectById, updateSubject, deleteSubject } from "@/controllers/subjectController";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return getSubjectById(params.id);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return updateSubject(params.id, req);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  return deleteSubject(params.id);
}
