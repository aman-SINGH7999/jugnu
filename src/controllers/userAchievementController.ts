import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { UserAchievement, Attempt, Result } from "@/models";

export async function getAchievementByUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const userId = params.id; // now safe

    // 🔹 1. Fetch user achievement
    const achievement = await UserAchievement.findOne({ user: userId })
      .populate("expertise", "name")
      .populate("subjectsScore.subjectId", "name");

    if (!achievement) {
      return NextResponse.json({ success: false, message: "No achievements found" }, { status: 404 });
    }

    // 🔹 2. Fetch all published results
    const today = new Date();

    const results = await Result.find({
      $or: [
        { publish: { $exists: false } }, // publish date not set
        { publish: { $gt: today } }      // publish date is in the future
      ]
    }).lean();

    const examIds = results.map(r => String(r.examId));
    const studentId = params.id;
    // 🔹 3. Fetch all attempts by the userId and examId
    const unPublishedAttempts = await Attempt.find({
      studentId: studentId,
      examId: { $in: examIds },
    }).populate("subjectsScore.subjectId", "name");

    for (const attempt of unPublishedAttempts) {
      achievement.rating -= attempt.totalScore;
      if(achievement.rating < 0) achievement.rating = 0;
      for (const subj of attempt.subjectsScore) {
        // achievement में subject ढूंढो
        const found = achievement.subjectsScore.find(
          (s:any) => s.subjectId.toString() === subj.subjectId.toString()
        );
        if (found) {
          found.marks -= 2*found.marks - subj.marks;
          if (found.marks < 0) found.marks = 0; // safety
        }
      }
    }
    
    const attempts = await Attempt.find({ studentId: studentId })
      .select("totalScore createdAt examId") // सिर्फ ज़रूरी fields
      .populate({
        path: "examId",
        select: "categoryId", // exam से सिर्फ categoryId चाहिए
        populate: {
          path: "categoryId",
          select: "name",     // category से सिर्फ name
        },
      })
      .lean();

      // console.log("attempts :  ", attempts)
      // console.log("examIds : ", examIds)
     const filteredAttempts = attempts.filter(
        (attempt) => !examIds.includes(String(attempt.examId._id))
      );
      // console.log("attempts :  ", attempts)

    const response = {
      expertise: achievement.expertise.map((s: any) => s.name),
      rating: achievement.rating,
      medals: achievement.medals, // You can adjust medals similarly if needed
      subjectsScore: achievement.subjectsScore,
      attempts: filteredAttempts,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (err: any) {
    console.error("getAchievementByUser error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


// ✅ Leaderboard (sorted by rating or medals)
export async function getLeaderboard() {
  try {
    await dbConnect();

    const leaderboard = await UserAchievement.find({})
      .populate("user", "name email image")
      .populate("expertise", "name")
      .populate("subjectsScore.subjectId", "name")
      .sort({ rating: -1, medals: -1 }) // Highest rating first, then medals
      .limit(50);

    return NextResponse.json({ success: true, data: leaderboard });
  } catch (err: any) {
    console.error("getLeaderboard error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
