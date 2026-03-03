import type { Metadata } from "next"
import { BookOpen } from "lucide-react"
import { InterviewPrepClient } from "@/components/interview-prep-client"
import fs from "fs"
import path from "path"

export const metadata: Metadata = {
  title: "DevOps Interview Prep",
  description: "Topic-wise DevOps interview questions for Docker, Kubernetes, AWS, CI/CD, and DevOps — Beginner to Advanced.",
}

const TOPIC_SLUGS = ["docker", "kubernetes", "aws", "devops", "cicd"]

function loadTopics() {
  return TOPIC_SLUGS.map((slug) => {
    const filePath = path.join(process.cwd(), "content", "interview", `${slug}.json`)
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    const questions: { id: number; question: string; answer: string; difficulty: "beginner" | "intermediate" | "advanced" }[] = raw.questions
    const counts = {
      beginner:     questions.filter((q) => q.difficulty === "beginner").length,
      intermediate: questions.filter((q) => q.difficulty === "intermediate").length,
      advanced:     questions.filter((q) => q.difficulty === "advanced").length,
    }
    return {
      slug,
      label:       raw.label       as string,
      color:       raw.color       as string,
      description: raw.description as string,
      questions,
      counts,
    }
  })
}

export default function InterviewPrepPage() {
  const topics = loadTopics()
  const totalQuestions = topics.reduce(
    (sum, t) => sum + t.counts.beginner + t.counts.intermediate + t.counts.advanced,
    0
  )

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600/10 to-violet-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-600/8 to-cyan-600/8 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Interview Prep</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Crack Your{" "}
            <span className="text-shimmer bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              DevOps Interview
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Topic-wise interview questions from Beginner to Advanced. Real questions asked at top companies — with detailed answers.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-muted-foreground">{totalQuestions} Questions</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-muted-foreground">{topics.length} Topics</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              <span className="text-muted-foreground">3 Difficulty Levels</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="text-muted-foreground">100% Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive filter + content */}
      <InterviewPrepClient topics={topics} totalQuestions={totalQuestions} />
    </div>
  )
}
