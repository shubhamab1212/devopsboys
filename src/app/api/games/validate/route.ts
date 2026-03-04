import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { userAnswer, bugs, code } = await req.json()

    if (!userAnswer?.trim()) {
      return NextResponse.json({ correct: false, feedback: "Please describe the bug you found." })
    }

    const bugsText = bugs
      .map((b: { line: number; description: string; fix: string }, i: number) => `Bug ${i + 1} (line ${b.line}): ${b.description}. Fix: ${b.fix}`)
      .join("\n")

    const prompt = `A user is playing a DevOps bug-finder game.

The buggy code:
\`\`\`
${code}
\`\`\`

The actual bugs in the code:
${bugsText}

The user's answer: "${userAnswer}"

Evaluate if the user identified the bug(s). Be generous — if they identified the core issue even with different wording, mark it correct.

Respond with ONLY valid JSON:
{
  "correct": true or false,
  "partial": true or false (true if they got some but not all bugs),
  "score": <0 to 100>,
  "feedback": "2-3 sentences: what they got right, what they missed, and a learning tip"
}`

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    })

    const raw = (message.content[0] as { type: string; text: string }).text.trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Invalid AI response")

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (err) {
    console.error("Validation error:", err)
    return NextResponse.json({ error: "Failed to validate answer" }, { status: 500 })
  }
}
