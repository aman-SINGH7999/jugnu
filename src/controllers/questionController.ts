import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getRequestUser } from "@/lib/getRequestUser";
import { Question } from "@/models";



// ✅ Create a new Question
export async function createQuestion(req: NextRequest) {
  
  try {
    await dbConnect();
    const body = await req.json();
    const user = getRequestUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const newQuestion = await Question.create({
      ...body,
      createdBy: user.id, // store creator
    });

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

// ✅ Get all Questions (optionally filter by subject or createdBy)
export async function getQuestions(req: NextRequest) {
  try {
    await dbConnect();

    const subjectId = req.nextUrl.searchParams.get("subjectId");
    const createdBy = req.nextUrl.searchParams.get("createdBy"); // ✅ new filter
    const search = req.nextUrl.searchParams.get("search") || "";
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10) || 1;
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10) || 10;

    const query: any = {};
    if (subjectId) query.subjectId = subjectId;
    if (createdBy) query.createdBy = createdBy; // ✅ filter by creator
    if (search) {
      query.text = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const [questions, totalCount] = await Promise.all([
      Question.find(query)
        .populate("subjectId")
        .populate("createdBy", "name email") // ✅ include creator details
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Question.countDocuments(query),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return NextResponse.json(
      { success: true, data: questions, totalPages },
      { status: 200 }
    );
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
  { params }: any
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
  { params }: any
) {
  
  try {
    await dbConnect();
    const body = await req.json();
    const user = getRequestUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      params.id,
      { ...body, createdBy: user.id },
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
  { params }: any
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
