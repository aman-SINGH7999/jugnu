// import { getAttemptById } from "@/controllers/attemptController";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  return NextResponse.json(
        { success: false, message: "hi" },
        { status: 500 }
      );
}
