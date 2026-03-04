import { NextRequest, NextResponse } from "next/server"

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

export async function POST(req: NextRequest) {
  try {
    const { difficulty = "medium", type = "dockerfile" } = await req.json()

    const typeLabel =
      type === "dockerfile"
        ? "Dockerfile"
        : type === "kubernetes"
        ? "Kubernetes YAML manifest"
        : type === "github-actions"
        ? "GitHub Actions workflow YAML"
        : "Docker Compose YAML"

    const difficultyDesc =
      difficulty === "easy"
        ? "a single obvious bug (beginner level)"
        : difficulty === "medium"
        ? "1-2 subtle bugs (intermediate level)"
        : "2-3 tricky bugs that are easy to miss (expert level)"

    const prompt = `You are a DevOps instructor creating a bug-finding challenge.

Generate a realistic ${typeLabel} with ${difficultyDesc}.

Rules:
- The code must look real and production-like, not toy examples
- Bugs should be realistic mistakes DevOps engineers actually make
- For easy: one clear bug (wrong port, missing tag, etc.)
- For medium: subtle issues (wrong resource limits, missing health check, security issue)
- For hard: multiple interacting bugs or non-obvious misconfigurations

Respond with ONLY valid JSON, no markdown, no code blocks:
{
  "title": "short descriptive title of what this config does",
  "code": "the full buggy code here (use \\n for newlines)",
  "bugs": [
    {
      "line": <line number where bug is>,
      "description": "what the bug is and why it's wrong",
      "fix": "what the correct value/approach should be"
    }
  ],
  "hint": "a subtle clue that points toward the bug without giving it away",
  "explanation": "a 2-3 sentence explanation of why these bugs matter in production"
}`

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("GEMINI_API_KEY not set")

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 1200 },
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

    const challenge = JSON.parse(jsonMatch[0])
    return NextResponse.json({ challenge, type, difficulty })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Challenge generation error:", msg)
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 })
  }
}
