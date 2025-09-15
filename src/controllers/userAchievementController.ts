import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { UserAchievement } from "@/models";




// ✅ Get Achievement by userId
export async function getAchievementByUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const achievement = await UserAchievement.findOne({ user: params.id }).populate("expertise");

    if (!achievement) {
      return NextResponse.json({ success: false, message: "No achievements found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: achievement });
  } catch (err: any) {
    console.error("getAchievementByUser error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


// ✅ Leaderboard (sorted by rating or rank)
export async function getLeaderboard() {
  try {
    await dbConnect();

    const leaderboard = await UserAchievement.find({})
      .populate("expertise")
      .sort({ rating: -1, medals: -1 }) // Highest rating first, then medals
      .limit(50);

    return NextResponse.json({ success: true, data: leaderboard });
  } catch (err: any) {
    console.error("getLeaderboard error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
