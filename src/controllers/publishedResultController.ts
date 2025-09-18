import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Result, Exam, Attempt, Question } from "@/models";
import mongoose from "mongoose";

// 🔹 Helper: check if result published & valid
async function isResultPublished(examId: string) {
  const result = await Result.findOne({
    examId: new mongoose.Types.ObjectId(examId),
    publish: { $lte: new Date() },
  });
  return !!result;
}

/**
 * 1. Exam ka result chahiye examId ke basis par
 *    - Question + Correct Answers
 */
export async function getExamResultByExam(req: NextRequest, { params }: { params: { examId: string } }) {
  // console.log("Exam id -----------------------------------------------------------------------------------")
  try {
    await dbConnect();

    const { examId } = params;

    const published = await isResultPublished(examId);
    if (!published) {
      return NextResponse.json({ success: false, message: "Result not published yet" }, { status: 403 });
    }

    // Exam with questions + answers
    const exam = await Exam.findById(examId)
      .populate({
        path: "questionIds",
        populate: { path: "subjectId", select: "name" },
      })
      .populate("categoryId", "name");

    if (!exam) {
      return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, exam }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * 2. Exam ka result chahiye user ke respect me
 *    - Question + Correct Answer + User Answer
 */
export async function getExamResultByUser(req: NextRequest, { params }: { params: { examId: string; userId: string } }) {

  // console.log("Exam id + user id dono chala hai**************************************************************")
  try {
    await dbConnect();

    const { examId, userId } = params;

    const published = await isResultPublished(examId);
    if (!published) {
      return NextResponse.json({ success: false, message: "Result not published yet" }, { status: 403 });
    }

    // Fetch attempt
    const attempt = await Attempt.findOne({ examId, studentId: userId })
      .populate({
        path: "answers.questionId",
        populate: { path: "subjectId", select: "name" },
      })
      .lean();

    if (!attempt) {
      return NextResponse.json({ success: false, message: "Attempt not found" }, { status: 404 });
    }

    // Merge with correct answers
    const detailedAnswers = attempt.answers.map((ans: any) => ({
      question: {
        id: ans.questionId._id,
        text: ans.questionId.text,
        explanation : ans.questionId.explanation,
        image: ans.questionId.image,
        options: ans.questionId.options,
        correctOptions: ans.questionId.options
          .map((opt: any, idx: number) => (opt.isCorrect ? idx : null))
          .filter((i: number | null) => i !== null),
      },
      userAnswer: ans.selectedOptions,
      isCorrect: ans.isCorrect,
    }));

    return NextResponse.json(
      {
        success: true,
        examId,
        studentId: userId,
        totalScore: attempt.totalScore,
        subjectsScore: attempt.subjectsScore,
        answers: detailedAnswers,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * 3. Sare exams chahiye (name, id, category)
 *    - Sirf published exams ke
 */
export async function getAllPublishedExams() {
  try {
    await dbConnect();

    const today = new Date();

    const results = await Result.find({ publish: { $lte: today } }).select("examId");

    const examIds = results.map(r => r.examId);

    const exams = await Exam.find({ _id: { $in: examIds } })
      .select("title categoryId")
      .populate("categoryId", "name");

    return NextResponse.json({ success: true, exams }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * 4. Ek user ke sare exams fetch karo
 *    - name, id, category, totalScore
 *    - Sirf published exams
 */
export async function getUserExamsWithScores(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
    // console.log("userId--------------", params.userId)
  try {
    await dbConnect();

    const userId = params.userId; // ✅ safe
    const today = new Date();

    // ✅ find published exams
    const publishedResults = await Result.find({ publish: { $lte: today } }).select("examId");
    const publishedExamIds = publishedResults.map(r => r.examId);

    // ✅ find attempts of user in published exams
    const attempts = await Attempt.find({
      studentId: new mongoose.Types.ObjectId(userId),
      examId: { $in: publishedExamIds },
    })
      .select("examId totalScore")
      .populate({
        path: "examId",
        select: "title categoryId",
        populate: { path: "categoryId", select: "name" },
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!attempts || attempts.length === 0) {
      return NextResponse.json(
        { success: false, message: "No attempts found for this user" },
        { status: 404 }
      );
    }

    // ✅ format response
    const exams = attempts.map(attempt => ({
      examId: attempt.examId._id,
      examTitle: attempt.examId.title,
      category: attempt.examId.categoryId?.name || null,
      totalScore: attempt.totalScore,
    }));

    return NextResponse.json({ success: true, exams }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}