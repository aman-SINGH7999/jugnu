import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Question, Exam, Attempt, UserAchievement } from "@/models";


export async function getUpcomingSoonExams(req: NextRequest) {
  try {
    await dbConnect();

    const categoryId = req.nextUrl.searchParams.get("categoryId");

    // today 04:00 AM
    const today = new Date();
    today.setHours(4, 0, 0, 0); // fix lower bound

    // 3 days later (till end of day)
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    threeDaysLater.setHours(23, 59, 59, 999);

    const query: any = {
      scheduledDate: { $gte: today, $lte: threeDaysLater },
    };

    if (categoryId) query.categoryId = categoryId;

    const exams = await Exam.find(query)
      .populate("categoryId", "name")
      .select("-__v")
      .sort({ scheduledDate: 1 });

    return NextResponse.json({ success: true, data: exams }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}




export async function getFutureExams(req: NextRequest) {
  try {
    await dbConnect();

    const categoryId = req.nextUrl.searchParams.get("categoryId");

    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const query: any = {
      scheduledDate: { $gt: threeDaysLater }
    };

    if (categoryId) query.categoryId = categoryId;

    const exams = await Exam.find(query)
      .populate("categoryId", "name")
      .select("-__v")
      .sort({ scheduledDate: 1 });

    return NextResponse.json({ success: true, data: exams }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}




//get safe exam
export async function getSafeExamById(req: Request | any, context: any) {
  try {
    await dbConnect();

    // Context.params in some Next versions can be a Promise-like. Be defensive:
    let paramsObj: any = undefined;
    try {
      if (context && typeof context.params !== "undefined") {
        // awaiting a non-promise is fine; if it's a promise it resolves properly
        paramsObj = await context.params;
      }
    } catch (e) {
      // fallback - try raw context.params
      paramsObj = context?.params ?? undefined;
    }

    // fallback to query param if not present
    const examId =
      paramsObj?.id ??
      paramsObj?.testId ??
      req?.nextUrl?.searchParams?.get("id") ??
      (typeof req?.url === "string" ? new URL(req.url).searchParams.get("id") : undefined);

    if (!examId) {
      return NextResponse.json({ success: false, message: "Missing exam id" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return NextResponse.json({ success: false, message: "Invalid exam id" }, { status: 400 });
    }

    // 1️⃣ Fetch Exam
    const exam = await Exam.findById(examId).populate("categoryId", "name").lean();
    if (!exam) {
      return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
    }

    // 2️⃣ Fetch questions safely and preserve ordering from exam.questionIds
    const questionsDocs = await Question.find({ _id: { $in: exam.questionIds || [] } })
      .select("text image options")
      .lean();

    // Map by id for ordering
    const qMap = new Map(questionsDocs.map((q: any) => [String(q._id), q]));

    const safeQuestions = (exam.questionIds || [])
      .map((id: any) => {
        const q = qMap.get(String(id));
        if (!q) return null;
        // convert options to plain strings (only option text) — hide `isCorrect`
        const options = (q.options || []).map((opt: any) => {
          if (typeof opt === "string") return opt;
          return opt.optionText ?? opt.text ?? String(opt);
        });
        return {
          _id: String(q._id),
          text: q.text ?? "",
          image: q.image ?? null,
          options,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        ...exam,
        questions: safeQuestions,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error("getSafeExamById error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}




// 🔹 SUBMIT EXAM
export async function submitExam(req: Request | any) {
  try {
    await dbConnect();

    const body = await req.json();
    const { examId, userId, answers } = body ?? {};

    if (!examId || !userId || !answers) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(examId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "Invalid examId or userId" }, { status: 400 });
    }

    // Load exam and its questions
    const exam = await Exam.findById(examId)
      .populate({
        path: "questionIds",
        select: "options text _id",
      })
      .populate("categoryId")
      .lean();

    if (!exam) {
      return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
    }

    // Normalize populated questions so each option has { optionText, isCorrect }
    const questions = (exam.questionIds || []).map((q: any) => {
      const opts = (q.options || []).map((o: any) => {
        if (typeof o === "string") {
          // If your schema stores only strings you can't determine isCorrect here.
          // In that case, ensure your schema stores isCorrect on options as objects.
          return { optionText: o, isCorrect: false };
        }
        return {
          optionText: o.optionText ?? o.text ?? "",
          isCorrect: !!o.isCorrect,
        };
      });
      return { ...q, options: opts };
    });

    let totalScore = 0;
    const attemptAnswers: any[] = [];

    const marksPerQue = typeof exam.marksParQue === "number" ? exam.marksParQue : 1;
    const negativePenalty = typeof exam.negative === "number" ? -Math.abs(exam.negative) : 0;

    for (const q of questions) {
      const qid = String(q._id);
      let userAns = answers[qid] ?? [];

      if (!Array.isArray(userAns)) userAns = [userAns];

      // Normalize indexes: accept numbers or numeric strings; fallback to try find by text (rare)
      const normalizedIndexes = Array.from(new Set(
        userAns.map((a: any) => {
          if (typeof a === "number") return a;
          if (typeof a === "string" && /^\d+$/.test(a)) return Number(a);
          const idx = (q.options || []).findIndex((opt: any) => (opt?.optionText ?? "") === String(a));
          return idx;
        })
      )).filter((n: any) => Number.isInteger(n) && n >= 0 && n < (q.options || []).length);

      const correctIndexes = (q.options || [])
        .map((opt: any, idx: number) => (opt && opt.isCorrect ? idx : -1))
        .filter((i: number) => i !== -1);

      const isCorrect =
        correctIndexes.length === normalizedIndexes.length &&
        correctIndexes.every((ci: number) => normalizedIndexes.includes(ci));

      let marksObtained = 0;
      if (isCorrect) marksObtained = marksPerQue;
      else if (normalizedIndexes.length > 0) marksObtained = negativePenalty;
      else marksObtained = 0;

      totalScore += marksObtained;

      attemptAnswers.push({
        questionId: q._id,
        selectedOptions: normalizedIndexes,
        isCorrect,
        marksObtained,
      });
    }

    if (!Number.isFinite(totalScore)) totalScore = 0;
    totalScore = Math.round((totalScore + Number.EPSILON) * 100) / 100;

    const attempt = await Attempt.create({
      studentId: userId,
      examId,
      answers: attemptAnswers,
      totalScore,
      submittedAt: new Date(),
    });

    const percentage = exam.totalMarks ? Math.round((totalScore / exam.totalMarks) * 10000) / 100 : 0;

    // Update achievements (adapt as per your logic)
    const update: any = {
      $addToSet: { expertise: exam.categoryId?._id },
      $inc: { rating: Math.round(percentage) },
    };
    if (percentage >= 95) update.$inc = { ...(update.$inc || {}), medals: 1 };

    const achievement = await UserAchievement.findOneAndUpdate(
      { user: userId },
      update,
      { new: true, upsert: true }
    ).populate("expertise");

    return NextResponse.json({
      success: true,
      data: { attempt, percentage, achievement },
    }, { status: 200 });

  } catch (error: any) {
    console.error("submitExam error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}