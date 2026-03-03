"use client"

import { useState } from "react"
import { ChevronDown, Eye, EyeOff } from "lucide-react"

interface Question {
  id: number
  question: string
  answer: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
    heading: "text-emerald-400",
    section: "Beginner Questions",
  },
  intermediate: {
    label: "Intermediate",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    dot: "bg-yellow-400",
    heading: "text-yellow-400",
    section: "Intermediate Questions",
  },
  advanced: {
    label: "Advanced",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
    heading: "text-red-400",
    section: "Advanced Questions",
  },
}

type Difficulty = "all" | "beginner" | "intermediate" | "advanced"

function QuestionCard({ question, index, hideAnswers }: { question: Question; index: number; hideAnswers: boolean }) {
  const [open, setOpen] = useState(false)
  const config = difficultyConfig[question.difficulty]

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-border/80">
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${config.badge}`}>
              {config.label}
            </span>
          </div>
          <p className="font-medium text-sm md:text-base leading-snug group-hover:text-primary transition-colors pr-4">
            {question.question}
          </p>
        </div>
        <ChevronDown
          className={`shrink-0 h-4 w-4 text-muted-foreground mt-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border">
          {hideAnswers ? (
            <div className="mt-4 flex flex-col items-center justify-center gap-2 py-6 rounded-lg bg-muted/30 border border-dashed border-border">
              <EyeOff className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Answer hidden — toggle &ldquo;Show Answers&rdquo; to reveal
              </p>
            </div>
          ) : (
            <div className="mt-4 prose prose-sm dark:prose-invert max-w-none">
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {question.answer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function QuestionList({ questions }: { questions: Question[] }) {
  const [filter, setFilter] = useState<Difficulty>("all")
  const [hideAnswers, setHideAnswers] = useState(false)

  const filtered = filter === "all" ? questions : questions.filter((q) => q.difficulty === filter)

  const grouped = {
    beginner: filtered.filter((q) => q.difficulty === "beginner"),
    intermediate: filtered.filter((q) => q.difficulty === "intermediate"),
    advanced: filtered.filter((q) => q.difficulty === "advanced"),
  }

  const filterOptions: { value: Difficulty; label: string }[] = [
    { value: "all", label: "All" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ]

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
            >
              {opt.label}
              {opt.value !== "all" && (
                <span className="ml-1.5 opacity-60">
                  ({questions.filter((q) => q.difficulty === opt.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Hide answers toggle */}
        <button
          onClick={() => setHideAnswers(!hideAnswers)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
        >
          {hideAnswers ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {hideAnswers ? "Show Answers" : "Hide Answers"}
        </button>
      </div>

      {/* Questions by section */}
      {(["beginner", "intermediate", "advanced"] as const).map((level) => {
        const qs = grouped[level]
        if (qs.length === 0) return null
        const config = difficultyConfig[level]
        return (
          <div key={level} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2 h-2 rounded-full ${config.dot}`} />
              <h2 className={`text-sm font-bold uppercase tracking-wider ${config.heading}`}>
                {config.section}
              </h2>
              <span className="text-xs text-muted-foreground">({qs.length})</span>
            </div>
            <div className="space-y-3">
              {qs.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} hideAnswers={hideAnswers} />
              ))}
            </div>
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No questions found for this filter.
        </div>
      )}
    </div>
  )
}
