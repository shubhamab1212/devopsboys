import { NextRequest, NextResponse } from "next/server"

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

export async function POST(req: NextRequest) {
  try {
    const { userAnswer, bugs, code } = await req.json()

    if (!userAnswer?.trim()) {
      return NextResponse.json({ correct: false, feedback: "Please describe the bug you found." })
    }

    const bugsText = bugs
      .map((b: { line: number; description: string; fix: string }, i: number) =>
        `Bug ${i + 1} (line ${b.line}): ${b.description}. Fix: ${b.fix}`
      )
      .join("\n")

    const prompt = `A user is playing a DevOps bug-finder game.

The buggy code:
${code}

The actual bugs in the code:
${bugsText}

The user's answer: "${userAnswer}"

Evaluate if the user identified the bug(s). Be generous — if they identified the core issue even with different wording, mark it correct.

Respond with ONLY valid JSON, no markdown, no code blocks:
{
  "correct": true or false,
  "partial": true or false,
  "score": <0 to 100>,
  "feedback": "2-3 sentences: what they got right, what they missed, and a learning tip"
}`

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("GEMINI_API_KEY not set")

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini API error: ${res.status} ${errText}`)
    }

    const geminiData = await res.json()
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!raw) throw new Error("Empty response from Gemini")

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Invalid JSON from Gemini")

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (err) {
    console.error("Validation error:", err)
    return NextResponse.json({ error: "Failed to validate answer" }, { status: 500 })
  }
}
