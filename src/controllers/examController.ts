import { NextRequest, NextResponse } from "next/server";
import Exam from "@/models/Exam";
import { dbConnect } from "@/lib/dbConnect";

// ✅ Create Exam
export async function createExam(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const newExam = await Exam.create(body);

    return NextResponse.json(
      { success: true, data: newExam },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get All Exams (with filters)
export async function getExams(req: NextRequest) {
  try {
    await dbConnect();

    const categoryId = req.nextUrl.searchParams.get("categoryId");
    const subjectId = req.nextUrl.searchParams.get("subjectId");
    const createdBy = req.nextUrl.searchParams.get("createdBy");

    let query: any = {};
    if (categoryId) query.categoryId = categoryId;
    if (subjectId) query.subjectIds = subjectId;
    if (createdBy) query.createdBy = createdBy;

    const exams = await Exam.find(query)
      .populate("categoryId")
      .populate("subjectIds")
      .populate("createdBy", "name email")
      .populate("questionIds");

    return NextResponse.json({ success: true, data: exams }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get Exam by ID
export async function getExamById(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const exam = await Exam.findById(params.id)
      .populate("categoryId")
      .populate("subjectIds")
      .populate("createdBy", "name email")
      .populate("questionIds");

    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: exam }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Update Exam
export async function updateExam(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();

    const updatedExam = await Exam.findByIdAndUpdate(params.id, body, {
      new: true,
    })
      .populate("categoryId")
      .populate("subjectIds")
      .populate("createdBy", "name email")
      .populate("questionIds");

    if (!updatedExam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedExam }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Delete Exam
export async function deleteExam(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const deletedExam = await Exam.findByIdAndDelete(params.id);

    if (!deletedExam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Exam deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
