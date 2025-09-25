import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Question, Exam, Attempt, Result, UserAchievement } from "@/models";
import { getRequestUser } from "@/lib/getRequestUser";


export async function getUpcomingSoonExams(req: NextRequest) {
  const user = getRequestUser(req);
  const userId = user?.id;

  try {
    await dbConnect();

    const categoryId = req.nextUrl.searchParams.get("categoryId");

    // today 04:00 AM
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3 days later (till end of day)
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    threeDaysLater.setHours(23, 59, 59, 999);

    const query: any = {
      scheduledDate: { $gte: today, $lte: threeDaysLater },
    };

    if (categoryId) query.categoryId = categoryId;

    // exams list
    const exams = await Exam.find(query)
      .populate("categoryId", "name")
      .select("-__v")
      .sort({ scheduledDate: 1 })
      .lean();

    // ✅ check user attempts
    if (userId) {
      const attempts = await Attempt.find({ studentId: userId })
        .select("examId")
        .lean();

      const attemptedExamIds = new Set(attempts.map((a) => String(a.examId)));

      exams.forEach((exam: any) => {
        exam.attempted = attemptedExamIds.has(String(exam._id));
      });
    }

    return NextResponse.json({ success: true, data: exams }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
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





/**
 * SUBMIT EXAM
 * - Save Attempt (with percentage scores)
 * - Update UserAchievement (with percentage scores)
 * - Ensure Result exists
 */
export async function submitExam(req: Request | NextRequest | any) {
  try {
    await dbConnect();

    const body = await req.json();
    const { examId, userId, answers } = body ?? {};

    if (!examId || !userId || !answers) {
      return NextResponse.json(
        { success: false, message: "Missing fields (examId, userId, answers)" },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(examId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid examId or userId" },
        { status: 400 }
      );
    }

    // ✅ Fetch exam with questions
    const exam = await Exam.findById(examId)
      .populate({ path: "questionIds", select: "options text _id subjectId" })
      .lean();

    if (!exam)
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );

    // ✅ Normalize questions
    const questions = (exam.questionIds || []).map((q: any) => {
      const opts = (q.options || []).map((o: any) =>
        typeof o === "string"
          ? { optionText: o, isCorrect: false }
          : {
              optionText: o.optionText ?? o.text ?? "",
              isCorrect: !!o.isCorrect,
            }
      );
      return { ...q, options: opts };
    });

    const marksPerQue =
      typeof exam.marksParQue === "number" ? exam.marksParQue : 1;
    const negativePenalty =
      typeof exam.negative === "number" ? -Math.abs(exam.negative) : 0;

    let totalScore = 0;
    const perSubjectScores: Record<string, number> = {};
    const subjectQuestionCount: Record<string, number> = {};
    const attemptAnswers: any[] = [];

    // ✅ Evaluate answers
    for (const q of questions) {
      const qid = String(q._id);
      let userAns = answers[qid] ?? [];
      if (!Array.isArray(userAns)) userAns = [userAns];

      const normalizedIndexes = Array.from(
        new Set(
          (userAns as any[]).map((a: any) => {
            if (typeof a === "number") return a;
            if (typeof a === "string" && /^\d+$/.test(a)) return Number(a);
            const idx = (q.options || []).findIndex(
              (opt: any) => (opt?.optionText ?? "") === String(a)
            );
            return idx;
          })
        )
      ).filter(
        (n: any) =>
          Number.isInteger(n) && n >= 0 && n < (q.options || []).length
      );

      const correctIndexes = (q.options || [])
        .map((opt: any, idx: number) => (opt?.isCorrect ? idx : -1))
        .filter((i: number) => i !== -1);

      const isCorrect =
        correctIndexes.length === normalizedIndexes.length &&
        correctIndexes.every((ci: number) => normalizedIndexes.includes(ci));

      let marksObtained = 0;
      if (isCorrect) marksObtained = marksPerQue;
      else if (normalizedIndexes.length > 0) marksObtained = negativePenalty;

      totalScore += marksObtained;

      attemptAnswers.push({
        questionId: q._id,
        selectedOptions: normalizedIndexes,
        isCorrect,
      });

      // ✅ Subject wise aggregation
      const subjId = q.subjectId
        ? String(q.subjectId._id ?? q.subjectId)
        : null;
      if (subjId) {
        perSubjectScores[subjId] = (perSubjectScores[subjId] || 0) + marksObtained;
        subjectQuestionCount[subjId] = (subjectQuestionCount[subjId] || 0) + 1;
      }
    }

    // ✅ Calculate percentages
    const totalPossibleMarks = (questions.length || 0) * marksPerQue;
    const totalPercent =
      totalPossibleMarks > 0 ? (totalScore / totalPossibleMarks) * 100 : 0;

    const attemptSubjectsScore = Object.entries(perSubjectScores).map(
      ([subjId, marks]) => {
        const maxMarks = (subjectQuestionCount[subjId] || 0) * marksPerQue;
        const percent = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;
        return {
          subjectId: new mongoose.Types.ObjectId(subjId),
          marks: Math.round((percent + Number.EPSILON) * 100) / 100,
        };
      }
    );

    // ✅ Save Attempt with % scores
    const savedAttempt = await Attempt.create({
      studentId: new mongoose.Types.ObjectId(userId),
      examId: new mongoose.Types.ObjectId(examId),
      answers: attemptAnswers,
      totalScore: Math.round((totalPercent + Number.EPSILON) * 100) / 100,
      subjectsScore: attemptSubjectsScore,
      submittedAt: new Date(),
    });

    // ✅ Ensure Result exists
    if (!(await Result.findOne({ examId }))) {
      await Result.create({ examId });
    }

    // ✅ Update UserAchievement
    let achievement: any = await UserAchievement.findOne({ user: userId });

    if (achievement) {
      achievement.subjectsScore = achievement.subjectsScore || [];

      for (const s of attemptSubjectsScore) {
        const existing = achievement.subjectsScore.find(
          (sub: any) => String(sub.subjectId) === String(s.subjectId)
        );
        if (existing) {
          existing.marks =
            Math.round(
              ((existing.marks + s.marks) / 2 + Number.EPSILON) * 100
            ) / 100;
        } else {
          achievement.subjectsScore.push(s);
        }
      }

      if (exam.categoryId) {
        achievement.expertise = achievement.expertise || [];
        if (
          !achievement.expertise.some(
            (e: any) => String(e) === String(exam.categoryId)
          )
        ) {
          achievement.expertise.push(exam.categoryId);
        }
      }

      achievement.rating = (achievement.rating || 0) + Math.round(totalPercent);
      if (totalPercent >= 95) {
        achievement.medals = (achievement.medals || 0) + 1;
      }

      await achievement.save();
    } else {
      achievement = await UserAchievement.create({
        user: userId,
        expertise: exam.categoryId ? [exam.categoryId] : [],
        subjectsScore: attemptSubjectsScore,
        rating: Math.round(totalPercent),
        medals: totalPercent >= 95 ? 1 : 0,
      });
    }

    return NextResponse.json(
      { success: true, data: { attempt: savedAttempt, achievement } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("submitExam error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
