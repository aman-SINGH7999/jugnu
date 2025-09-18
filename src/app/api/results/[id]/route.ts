import { NextRequest } from "next/server";
import { getResultById, updateResult, deleteResult } from "@/controllers/resultController";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return getResultById(params.id);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { publish } = body ?? {};
  return updateResult(params.id, publish);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return deleteResult(params.id);
}
