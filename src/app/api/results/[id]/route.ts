import { NextRequest } from "next/server";
import { getResultById, updateResult, deleteResult } from "@/controllers/resultController";

export async function GET(req: NextRequest, { params }: any) {
  return getResultById(params.id);
}

export async function PUT(req: NextRequest, { params }: any) {
  const body = await req.json();
  const { publish } = body ?? {};
  return updateResult(params.id, publish);
}

export async function DELETE(req: NextRequest, { params }: any) {
  return deleteResult(params.id);
}
