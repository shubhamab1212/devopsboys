"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Container, Layers, Cloud, GitBranch, Server, BookOpen } from "lucide-react"

interface Question {
  id: number
  question: string
  answer: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface TopicData {
  slug: string
  label: string
  color: string
  description: string
  questions: Question[]
  counts: { beginner: number; intermediate: number; advanced: number }
}

type Filter = "all" | "beginner" | "intermediate" | "advanced"

const difficultyConfig = {
  beginner:     { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", active: "bg-emerald-500 text-white border-emerald-500" },
  intermediate: { badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",   active: "bg-yellow-500 text-white border-yellow-500"  },
  advanced:     { badge: "bg-red-500/10 text-red-400 border-red-500/20",             active: "bg-red-500 text-white border-red-500"        },
}

const topicConfig: Record<string, { icon: React.ElementType; iconBg: string; iconColor: string; border: string; gradient: string }> = {
  docker:     { icon: Container, iconBg: "bg-blue-500/10",    iconColor: "text-blue-400",    border: "border-blue-500/20",    gradient: "from-blue-500/10 to-transparent"    },
  kubernetes: { icon: Layers,    iconBg: "bg-violet-500/10",  iconColor: "text-violet-400",  border: "border-violet-500/20",  gradient: "from-violet-500/10 to-transparent"  },
  aws:        { icon: Cloud,     iconBg: "bg-orange-500/10",  iconColor: "text-orange-400",  border: "border-orange-500/20",  gradient: "from-orange-500/10 to-transparent"  },
  devops:     { icon: Server,    iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400", border: "border-emerald-500/20", gradient: "from-emerald-500/10 to-transparent" },
  cicd:       { icon: GitBranch, iconBg: "bg-cyan-500/10",    iconColor: "text-cyan-400",    border: "border-cyan-500/20",    gradient: "from-cyan-500/10 to-transparent"    },
}

function QuestionAccordion({ question, index }: { question: Question; index: number }) {
  const [open, setOpen] = useState(false)
  const config = difficultyConfig[question.difficulty]
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button className="w-full text-left px-5 py-4 flex items-start gap-3 group" onClick={() => setOpen(!open)}>
        <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground mt-0.5">
          {index + 1}
        </span>
        <p className="flex-1 text-sm font-medium leading-snug group-hover:text-primary transition-colors pr-3">
          {question.question}
        </p>
        <ChevronDown className={`shrink-0 h-4 w-4 text-muted-foreground mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border">
          <div className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {question.answer}
          </div>
        </div>
      )}
    </div>
  )
}

export function InterviewPrepClient({ topics, totalQuestions }: { topics: TopicData[]; totalQuestions: number }) {
  const [filter, setFilter] = useState<Filter>("all")

  const filterOptions: { value: Filter; label: string }[] = [
    { value: "all", label: "All Topics" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ]

  const isFiltered = filter !== "all"

  return (
    <>
      {/* Filter bar */}
      <div className="container mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Filter:</span>
          {filterOptions.map((opt) => {
            const isActive = filter === opt.value
            const diffCls = opt.value !== "all" ? difficultyConfig[opt.value as keyof typeof difficultyConfig] : null
            return (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isActive
                    ? opt.value === "all"
                      ? "bg-primary text-primary-foreground border-primary"
                      : diffCls?.active
                    : opt.value === "all"
                    ? "bg-card border-border text-muted-foreground hover:text-foreground"
                    : `${diffCls?.badge} hover:opacity-80`
                }`}
              >
                {opt.label}
                {opt.value !== "all" && (
                  <span className="ml-1.5 opacity-70">
                    ({topics.reduce((s, t) => s + t.questions.filter(q => q.difficulty === opt.value).length, 0)})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <section className="container mx-auto max-w-5xl px-4 pb-16">

        {/* Topic cards view (default) */}
        {!isFiltered && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => {
                const cfg = topicConfig[topic.slug]
                const Icon = cfg?.icon ?? BookOpen
                const total = topic.counts.beginner + topic.counts.intermediate + topic.counts.advanced
                return (
                  <Link
                    key={topic.slug}
                    href={`/interview-prep/${topic.slug}`}
                    className={`group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cfg?.border ?? "border-border"}`}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cfg?.gradient ?? ""} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                    <div className="relative">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg?.iconBg} mb-4`}>
                        <Icon className={`h-5 w-5 ${cfg?.iconColor}`} />
                      </div>
                      <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{topic.label}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{topic.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyConfig.beginner.badge}`}>{topic.counts.beginner} Beginner</span>
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyConfig.intermediate.badge}`}>{topic.counts.intermediate} Intermediate</span>
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyConfig.advanced.badge}`}>{topic.counts.advanced} Advanced</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{total} questions</span>
                        <span className={`flex items-center gap-1 font-medium ${cfg?.iconColor} group-hover:gap-2 transition-all`}>
                          Start <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
              <p className="text-sm text-muted-foreground">More topics coming soon — Terraform, Linux, Networking, Helm, Monitoring & more.</p>
            </div>
          </>
        )}

        {/* Filtered questions view */}
        {isFiltered && (
          <div className="space-y-10">
            {topics.map((topic) => {
              const qs = topic.questions.filter(q => q.difficulty === filter)
              if (qs.length === 0) return null
              const cfg = topicConfig[topic.slug]
              const Icon = cfg?.icon ?? BookOpen
              return (
                <div key={topic.slug}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg?.iconBg}`}>
                      <Icon className={`h-4 w-4 ${cfg?.iconColor}`} />
                    </div>
                    <h2 className="font-bold text-base">{topic.label}</h2>
                    <span className="text-xs text-muted-foreground">({qs.length} questions)</span>
                    <Link href={`/interview-prep/${topic.slug}`} className={`ml-auto text-xs ${cfg?.iconColor} hover:underline flex items-center gap-1`}>
                      All {topic.label} <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {qs.map((q, i) => <QuestionAccordion key={q.id} question={q} index={i} />)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
