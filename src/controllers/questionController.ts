import { NextRequest, NextResponse } from "next/server";
import Question from "@/models/Question";
import { dbConnect } from "@/lib/dbConnect";

// ✅ Create a new Question
export async function createQuestion(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const newQuestion = await Question.create(body);

    return NextResponse.json(
      { success: true, data: newQuestion },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get all Questions (optionally filter by subject)
export async function getQuestions(req: NextRequest) {
  try {
    await dbConnect();

    const subjectId = req.nextUrl.searchParams.get("subjectId");
    const search = req.nextUrl.searchParams.get("search") || "";
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10) || 1;
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10) || 10;

    const query: any = {};
    if (subjectId) query.subjectId = subjectId;
    if (search) {
      // simple text search on `text` field (case-insensitive)
      // If you store HTML in `text`, regex still works — but be careful with performance for large collections.
      query.text = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const [questions, totalCount] = await Promise.all([
      Question.find(query).populate("subjectId").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Question.countDocuments(query),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return NextResponse.json({ success: true, data: questions, totalPages }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get a Single Question by ID
export async function getQuestionById(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const question = await Question.findById(params.id).populate("subjectId");

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: question }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Update Question
export async function updateQuestion(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();

    const updatedQuestion = await Question.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!updatedQuestion) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedQuestion },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Delete Question
export async function deleteQuestion(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const deletedQuestion = await Question.findByIdAndDelete(params.id);

    if (!deletedQuestion) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Question deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
