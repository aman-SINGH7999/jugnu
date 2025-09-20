import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { subject, description, noOfQuestions } = await req.json();

    const prompt = `
    Generate ${noOfQuestions} multiple choice questions for subject "${subject}".
    Level: ${description}.
    Format response in JSON array like:
    [
      {
        "question": "string",
        "options": ["A", "B", "C", "D"],
        "answer": "correct option text"
      }
    ]
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // console.log("question data: ", data)
    let parsed = [];
    try {
      // ✅ JSON ko clean karke parse karo
      const match = rawText.match(/\[[\s\S]*\]/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.error("Parsing error:", e, rawText);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
