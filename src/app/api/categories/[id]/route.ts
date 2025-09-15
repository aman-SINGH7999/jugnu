
// category/[id]/route.ts
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/controllers/categoryController";

export async function GET(req: Request, context: any) {
  return getCategoryById(req as any, context);
}

export async function PUT(req: Request, context: any) {
  return updateCategory(req as any, context);
}

export async function DELETE(req: Request, context: any) {
  return deleteCategory(req as any, context);
}
