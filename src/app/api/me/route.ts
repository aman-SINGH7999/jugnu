// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/getRequestUser";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";

export async function GET(req: NextRequest) {
  try {
    // 1) Try header forwarded by middleware
    let userInfo = getRequestUser(req); // reads x-user-id + x-user-role

    // 2) Fallback: check token cookie directly (if middleware didn't run / header missing)
    if (!userInfo) {
      const token = req.cookies.get("token")?.value;
      if (token) {
        const decoded = verifyToken(token);
        if (decoded && (decoded as any).id) {
          userInfo = { id: (decoded as any).id, role: (decoded as any).role || "student" };
        } else {
          // token existed but invalid
          return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }
      }
    }

    if (!userInfo) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(userInfo.id).select("-password");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user?.name,
        email: user.email,
        role: user?.role,
        image: user?.image,
        provider: "unknown",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Something went wrong" }, { status: 500 });
  }
}
