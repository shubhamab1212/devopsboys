import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const DIFFICULTY_TOKENS = { easy: 600, medium: 800, hard: 1000 }

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

Respond with ONLY valid JSON in this exact format:
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

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: DIFFICULTY_TOKENS[difficulty as keyof typeof DIFFICULTY_TOKENS],
      messages: [{ role: "user", content: prompt }],
    })

    const raw = (message.content[0] as { type: string; text: string }).text.trim()
    // Extract JSON even if there's extra text
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Invalid response from AI")

    const challenge = JSON.parse(jsonMatch[0])
    return NextResponse.json({ challenge, type, difficulty })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Challenge generation error:", msg)
    // Check for common Anthropic API errors
    if (msg.includes("credit balance")) {
      return NextResponse.json({ error: "API credits exhausted. Please add credits at console.anthropic.com" }, { status: 500 })
    }
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 })
  }
}
