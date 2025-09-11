import { NextRequest, NextResponse } from "next/server";
import Attempt from "@/models/Attempt";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import { dbConnect } from "@/lib/dbConnect";

// ✅ Create Attempt (submit exam)
export async function createAttempt(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { studentId, examId, answers, startedAt, submittedAt } = body;

    // exam fetch
    const exam = await Exam.findById(examId).populate("questionIds");
    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    let totalScore = 0;
    const evaluatedAnswers = [];

    // evaluate answers
    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);
      if (!question) continue;

      const correctOptions = question.options
        .map((opt, i) => (opt.isCorrect ? i : -1))
        .filter((i) => i !== -1);

      const isCorrect =
        JSON.stringify(correctOptions.sort()) ===
        JSON.stringify(ans.selectedOptions.sort());

      const marksObtained = isCorrect
        ? exam.marksParQue
        : exam.negative

      totalScore += marksObtained;

      evaluatedAnswers.push({
        questionId: ans.questionId,
        selectedOptions: ans.selectedOptions,
        isCorrect,
        marksObtained,
      });
    }

    // create attempt
    const attempt = await Attempt.create({
      studentId,
      examId,
      answers: evaluatedAnswers,
      totalScore,
      startedAt,
      submittedAt,
    });

    return NextResponse.json(
      { success: true, data: attempt },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get All Attempts (optionally filter by student or exam)
export async function getAttempts(req: NextRequest) {
  try {
    await dbConnect();

    const studentId = req.nextUrl.searchParams.get("studentId");
    const examId = req.nextUrl.searchParams.get("examId");

    let query: any = {};
    if (studentId) query.studentId = studentId;
    if (examId) query.examId = examId;

    const attempts = await Attempt.find(query)
      .populate("studentId", "name email")
      .populate("examId");

    return NextResponse.json({ success: true, data: attempts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get Attempt by ID
export async function getAttemptById(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const attempt = await Attempt.findById(params.id)
      .populate("studentId", "name email")
      .populate("examId")
      .populate("answers.questionId");

    if (!attempt) {
      return NextResponse.json(
        { success: false, message: "Attempt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: attempt }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
