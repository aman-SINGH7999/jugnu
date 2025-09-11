// server/controllers/examController.ts
import { NextRequest, NextResponse } from "next/server";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import { dbConnect } from "@/lib/dbConnect";
import { getRequestUser } from "@/lib/getRequestUser";

export async function createExam(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const user = getRequestUser ? getRequestUser(req) : null;

    const createdBy = user?.id;
    
    // Basic validation
    const { title, duration, questionIds = [], marksParQue = 4, negative = 0, categoryId } = body;
    if (!title || !categoryId || !createdBy) {
      return NextResponse.json({ success: false, message: "title, categoryId and createdBy are required" }, { status: 400 });
    }
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ success: false, message: "Provide at least one questionId" }, { status: 400 });
    }
    if (typeof duration !== "number" || duration <= 0) {
      return NextResponse.json({ success: false, message: "duration must be a positive number (minutes)" }, { status: 400 });
    }

    // Optional: validate question ids exist (recommended)
    const foundCount = await Question.countDocuments({ _id: { $in: questionIds } });
    if (foundCount !== questionIds.length) {
      return NextResponse.json({ success: false, message: "Some questionIds are invalid" }, { status: 400 });
    }

    // Compute totalMarks server-side to avoid inconsistency
    const totalMarks = marksParQue * questionIds.length;

    const payload = {
      title,
      description: body.description || "",
      categoryId,
      duration,
      totalMarks,
      createdBy,
      questionIds,
      negative,
      marksParQue,
    };

    const newExam = await Exam.create(payload);

    return NextResponse.json({ success: true, data: newExam }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


// GET /api/exams with filters
export async function getExams(req: NextRequest) {
  try {
    await dbConnect();

    const categoryId = req.nextUrl.searchParams.get("categoryId");
    const createdBy = req.nextUrl.searchParams.get("createdBy");
    const search = req.nextUrl.searchParams.get("search") || "";
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const limit = Math.min(50, parseInt(req.nextUrl.searchParams.get("limit") || "10", 10));

    const query: any = {};
    if (categoryId) query.categoryId = categoryId;
    if (createdBy) query.createdBy = createdBy;
    if (search) {
      // Regex search on title and description
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [exams, totalCount] = await Promise.all([
      Exam.find(query)
        .populate("categoryId", "name")
        .populate("createdBy", "name email")
        // caution: populate questions may be heavy; select subset if needed
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Exam.countDocuments(query),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    return NextResponse.json({ success: true, data: exams, totalPages, totalCount }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
export async function updateExam(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();

    // if questionIds or marksParQue present, recompute totalMarks
    if (body.questionIds || body.marksParQue) {
      const exam = await Exam.findById(params.id);
      if (!exam) return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });

      const questionIds = body.questionIds ?? exam.questionIds;
      const marksParQue = typeof body.marksParQue === "number" ? body.marksParQue : exam.marksParQue;
      body.totalMarks = marksParQue * (Array.isArray(questionIds) ? questionIds.length : 0);
    }

    const updatedExam = await Exam.findByIdAndUpdate(params.id, body, { new: true })
      .populate("categoryId", "name")
      .populate("createdBy", "name email")
      .populate("questionIds", "text");

    if (!updatedExam) return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedExam }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
