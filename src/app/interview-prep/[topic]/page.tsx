import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { QuestionList } from "@/components/question-list"
import fs from "fs"
import path from "path"

interface Question {
  id: number
  question: string
  answer: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface TopicData {
  topic: string
  label: string
  description: string
  color: string
  questions: Question[]
}

const TOPIC_SLUGS = ["docker", "kubernetes", "aws", "devops", "cicd"]

function getTopicData(slug: string): TopicData | null {
  if (!TOPIC_SLUGS.includes(slug)) return null
  const filePath = path.join(process.cwd(), "content", "interview", `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as TopicData
}

export async function generateStaticParams() {
  return TOPIC_SLUGS.map((slug) => ({ topic: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params
  const data = getTopicData(topic)
  if (!data) return {}
  return {
    title: `${data.label} Interview Questions`,
    description: data.description,
  }
}

const colorMap: Record<string, { badge: string; heading: string }> = {
  blue: { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", heading: "text-blue-400" },
  violet: { badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", heading: "text-violet-400" },
  orange: { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", heading: "text-orange-400" },
  emerald: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", heading: "text-emerald-400" },
  cyan: { badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", heading: "text-cyan-400" },
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const data = getTopicData(topic)
  if (!data) notFound()

  const colors = colorMap[data.color] ?? colorMap.blue
  const beginner = data.questions.filter((q) => q.difficulty === "beginner")
  const intermediate = data.questions.filter((q) => q.difficulty === "intermediate")
  const advanced = data.questions.filter((q) => q.difficulty === "advanced")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
        <div className="container mx-auto max-w-4xl px-4 py-10 relative">
          <Link
            href="/interview-prep"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            All Topics
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Interview Prep</span>
          </div>

          <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-3 ${colors.heading}`}>
            {data.label} Interview Questions
          </h1>
          <p className="text-muted-foreground mb-5 max-w-2xl leading-relaxed">{data.description}</p>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              {beginner.length} Beginner
            </span>
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-medium">
              {intermediate.length} Intermediate
            </span>
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium">
              {advanced.length} Advanced
            </span>
            <span className="px-3 py-1 rounded-full bg-card border border-border text-xs font-medium text-muted-foreground">
              {data.questions.length} Total
            </span>
          </div>
        </div>
      </section>

      {/* Questions */}
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <QuestionList questions={data.questions} />
      </div>
    </div>
  )
}
