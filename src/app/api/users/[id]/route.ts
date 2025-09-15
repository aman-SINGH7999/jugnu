//users/[id]/route.ts
import { getUserById, updateUser } from "@/controllers/userController";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return getUserById(params.id);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return updateUser(params.id, req);
}

