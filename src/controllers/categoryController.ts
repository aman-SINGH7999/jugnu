import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/models";
import { dbConnect } from "@/lib/dbConnect";

// ✅ Create Category
export async function createCategory(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const newCategory = await Category.create(body);

    return NextResponse.json(
      { success: true, data: newCategory },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get All Categories
export async function getCategories(req: NextRequest) {
  try {
    await dbConnect();

    const categories = await Category.find().populate("subjects");

    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get Category by ID
export async function getCategoryById(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const category = await Category.findById(params.id).populate("subjects");

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Update Category
export async function updateCategory(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    ).populate("subjects");

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedCategory },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Delete Category
export async function deleteCategory(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const deletedCategory = await Category.findByIdAndDelete(params.id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
