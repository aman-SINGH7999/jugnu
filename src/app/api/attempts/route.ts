// import { createAttempt, getAttempts } from "@/controllers/attemptController";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json(
          { success: false, message: "hi" },
          { status: 500 }
        );
}

export async function POST(req: Request) {
  return NextResponse.json(
          { success: false, message: "hi" },
          { status: 500 }
        );
}
