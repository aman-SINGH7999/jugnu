import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import Result from "@/models/Result";

/**
 * GET all Results
 */
export async function getResults() {
  try {
    await dbConnect();

    const results = await Result.find()
      .populate("examId", "title totalMarks")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: results }, { status: 200 });
  } catch (error: any) {
    console.error("getResults error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/**
 * GET single Result
 */
export async function getResultById(id: string) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const result = await Result.findById(id).populate("examId", "title totalMarks");
    if (!result) {
      return NextResponse.json({ success: false, message: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    console.error("getResultById error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/**
 * UPDATE Result - only publish date
 */
export async function updateResult(id: string, publish: string) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    if (!publish) {
      return NextResponse.json({ success: false, message: "Publish date is required" }, { status: 400 });
    }

    const updated = await Result.findByIdAndUpdate(
      id,
      { publish: new Date(publish) },
      { new: true }
    ).populate("examId", "title totalMarks");

    if (!updated) {
      return NextResponse.json({ success: false, message: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("updateResult error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/**
 * DELETE Result
 */
export async function deleteResult(id: string) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const deleted = await Result.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Result deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("deleteResult error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
