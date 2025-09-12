import { getUserById, deleteUser, updateUser } from "@/controllers/userController";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return getUserById(params.id);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return updateUser(params.id, req);
}

// export async function DELETE(_: Request, { params }: { params: { id: string } }) {
//   return deleteUser(params.id);
// }