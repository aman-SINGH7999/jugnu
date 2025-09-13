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
    const user = getRequestUser(req);

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const createdBy = user.id;
    const {
      title,
      description,
      duration,
      marksParQue = 4,
      negative = 0,
      categoryId,
      questionIds,
      scheduledDate,
    } = body;

    // 🔹 Validation
    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, message: "title is required" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ success: false, message: "categoryId is required" }, { status: 400 });
    }
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ success: false, message: "Provide at least one questionId" }, { status: 400 });
    }
    if (typeof duration !== "number" || duration <= 0) {
      return NextResponse.json({ success: false, message: "duration must be a positive number (minutes)" }, { status: 400 });
    }

    // 🔹 Verify questions exist
    const foundCount = await Question.countDocuments({ _id: { $in: questionIds } });
    if (foundCount !== questionIds.length) {
      return NextResponse.json({ success: false, message: "Some questionIds are invalid" }, { status: 400 });
    }

    // 🔹 Compute total marks
    const totalMarks = marksParQue * questionIds.length;

    // 🔹 Parse scheduledDate (same logic as updateExam)
    let parsedDate: Date | null = null;
    if (Object.prototype.hasOwnProperty.call(body, "scheduledDate")) {
      const raw = scheduledDate;
      if (raw === null || raw === "" || raw === undefined) {
        parsedDate = null;
      } else {
        parsedDate = new Date(raw);
        if (isNaN(parsedDate.getTime())) {
          const match = String(raw).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/);
          if (match) {
            const [y, m, d] = match[1].split("-").map(Number);
            const [hh, mm] = match[2].split(":").map(Number);
            parsedDate = new Date(y, m - 1, d, hh, mm, 0);
          }
        }
        if (!parsedDate || isNaN(parsedDate.getTime())) {
          return NextResponse.json({ success: false, message: "Invalid scheduledDate" }, { status: 400 });
        }
      }
    }

    // 🔹 Create exam
    const newExam = await Exam.create({
      title,
      description: description || "",
      categoryId,
      duration,
      marksParQue,
      negative,
      totalMarks,
      createdBy,
      questionIds,
      scheduledDate: parsedDate,
    });

    return NextResponse.json({ success: true, data: newExam }, { status: 201 });
  } catch (error: any) {
    console.error("createExam error:", error);
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

// ✅ Update Exam (improved + debug)
export async function updateExam(req: NextRequest, { params }: { params: any }) {
  try {
    await dbConnect();

    // Next.js warning fix: await params (params can be a promise)
    const { id } = await params;
    const body = await req.json();
    const user = getRequestUser(req);

    console.log("updateExam: received body =>", body);

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const exam = await Exam.findById(id);
    if (!exam) {
      return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
    }

    // Authorization
    if (exam.createdBy.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const {
      title,
      description,
      duration,
      marksParQue,
      negative,
      categoryId,
      questionIds,
    } = body;

    // Basic validation
    if (title && !title.trim()) {
      return NextResponse.json({ success: false, message: "Title cannot be empty" }, { status: 400 });
    }
    if (duration !== undefined && (typeof duration !== "number" || duration <= 0)) {
      return NextResponse.json({ success: false, message: "duration must be a positive number (minutes)" }, { status: 400 });
    }
    if (questionIds && (!Array.isArray(questionIds) || questionIds.length === 0)) {
      return NextResponse.json({ success: false, message: "Provide at least one questionId" }, { status: 400 });
    }

    if (questionIds) {
      const foundCount = await Question.countDocuments({ _id: { $in: questionIds } });
      if (foundCount !== questionIds.length) {
        return NextResponse.json({ success: false, message: "Some questionIds are invalid" }, { status: 400 });
      }
    }

    // Update fields
    if (title !== undefined) exam.title = title;
    if (description !== undefined) exam.description = description;
    if (categoryId !== undefined) exam.categoryId = categoryId;
    if (duration !== undefined) exam.duration = duration;
    if (marksParQue !== undefined) exam.marksParQue = marksParQue;
    if (negative !== undefined) exam.negative = negative;
    if (questionIds !== undefined) exam.questionIds = questionIds;

    // scheduledDate 
    if (Object.prototype.hasOwnProperty.call(body, "scheduledDate")) {
      const raw = body.scheduledDate;
      console.log("updateExam: raw scheduledDate =>", raw, " typeof:", typeof raw);

      if (raw === null || raw === "" || raw === undefined) {
        exam.scheduledDate = null;
      } else {
        let parsedDate: Date | null = null;

        // If it's already an ISO-ish string
        parsedDate = new Date(raw);
        if (isNaN(parsedDate.getTime())) {
          // If client sent "YYYY-MM-DDTHH:mm" (datetime-local)
          const match = String(raw).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/);
          if (match) {
            const asLocal = match[1] + "T" + match[2] + ":00";
            // Interpret as local by constructing with components:
            const [y, mo, d] = match[1].split("-").map(Number);
            const [hh, mm] = match[2].split(":").map(Number);
            parsedDate = new Date(y, mo - 1, d, hh, mm, 0);
          }
        }

        if (!parsedDate || isNaN(parsedDate.getTime())) {
          console.error("updateExam: invalid scheduledDate format ->", raw);
          return NextResponse.json({ success: false, message: "Invalid scheduledDate" }, { status: 400 });
        }

        exam.scheduledDate = parsedDate;
      }
    }


    // Recompute total marks if questions/marks changed
    if (exam.questionIds && exam.marksParQue) {
      exam.totalMarks = exam.marksParQue * exam.questionIds.length;
    }

    await exam.save();

    // Fetch fresh copy from DB to be 100% sure what's stored
    const fresh = await Exam.findById(id).lean();
    console.log("updateExam: saved fresh =>", fresh);

    return NextResponse.json({ success: true, data: fresh }, { status: 200 });
  } catch (error: any) {
    console.error("updateExam: caught error", error);
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
