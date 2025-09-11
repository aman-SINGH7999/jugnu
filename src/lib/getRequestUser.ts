// lib/getRequestUser.ts
import { NextRequest } from "next/server";

export function getRequestUser(req: NextRequest) {
  const id = req.headers.get("x-user-id");
  const role = req.headers.get("x-user-role");

  if (!id || !role) return null;

  return { id, role };
}
