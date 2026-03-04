import { NextRequest, NextResponse } from "next/server"
import { validateAnswer } from "@/lib/challenges"
import type { Challenge } from "@/lib/challenges"

export async function POST(req: NextRequest) {
  try {
    const { userAnswer, challenge } = await req.json()

    if (!userAnswer?.trim()) {
      return NextResponse.json({ correct: false, partial: false, score: 0, feedback: "Please describe the bug you found." })
    }

    const result = validateAnswer(userAnswer, challenge as Challenge)
    return NextResponse.json(result)
  } catch (err) {
    console.error("Validation error:", err)
    return NextResponse.json({ error: "Failed to validate answer" }, { status: 500 })
  }
}
