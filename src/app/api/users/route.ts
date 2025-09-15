//api/users/route.ts
import { getAllUsers } from "@/controllers/userController";

export async function GET() {
  return getAllUsers();
}