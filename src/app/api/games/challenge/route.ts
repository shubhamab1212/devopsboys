import { NextRequest, NextResponse } from "next/server"
import { getRandomChallenge } from "@/lib/challenges"

export async function POST(req: NextRequest) {
  try {
    const { difficulty = "medium", type = "dockerfile" } = await req.json()
    const challenge = getRandomChallenge(
      type as "dockerfile" | "kubernetes",
      difficulty as "easy" | "medium" | "hard"
    )
    return NextResponse.json({ challenge, type, difficulty })
  } catch (err) {
    console.error("Challenge error:", err)
    return NextResponse.json({ error: "Failed to get challenge" }, { status: 500 })
  }
}
