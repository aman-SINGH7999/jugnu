//users/[id]/route.ts
import { getUserById, updateUser } from "@/controllers/userController";

export async function GET(_: Request, { params }: any) {
  return getUserById(params.id);
}

export async function PUT(req: Request, { params }: any) {
  return updateUser(params.id, req);
}

