//category/route.ts
import { createCategory, getCategories } from "@/controllers/categoryController";

export async function GET(req: Request) {
  return getCategories(req as any);
}

export async function POST(req: Request) {
  return createCategory(req as any);
}
