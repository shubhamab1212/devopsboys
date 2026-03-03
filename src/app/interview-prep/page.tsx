import Link from "next/link"
import type { Metadata } from "next"
import { BookOpen, ChevronRight, Layers, Cloud, Container, GitBranch, Server } from "lucide-react"

export const metadata: Metadata = {
  title: "DevOps Interview Prep",
  description: "Topic-wise DevOps interview questions for Docker, Kubernetes, AWS, CI/CD, and DevOps — Beginner to Advanced.",
}

const topics = [
  {
    slug: "docker",
    label: "Docker",
    description: "Container fundamentals, images, networking, volumes, multi-stage builds, and production security.",
    icon: Container,
    color: "blue",
    gradient: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20 hover:border-blue-500/50",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    glow: "hover:shadow-blue-500/10",
    counts: { beginner: 5, intermediate: 5, advanced: 5 },
  },
  {
    slug: "kubernetes",
    label: "Kubernetes",
    description: "Architecture, workloads, networking, RBAC, autoscaling, operators, and troubleshooting.",
    icon: Layers,
    color: "violet",
    gradient: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20 hover:border-violet-500/50",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    glow: "hover:shadow-violet-500/10",
    counts: { beginner: 5, intermediate: 5, advanced: 5 },
  },
  {
    slug: "aws",
    label: "AWS",
    description: "IAM, VPC, EC2, S3, EKS, Lambda, IRSA, cost optimization, and cloud architecture.",
    icon: Cloud,
    color: "orange",
    gradient: "from-orange-500/20 to-orange-600/5",
    border: "border-orange-500/20 hover:border-orange-500/50",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    glow: "hover:shadow-orange-500/10",
    counts: { beginner: 5, intermediate: 4, advanced: 4 },
  },
  {
    slug: "devops",
    label: "DevOps",
    description: "DevOps culture, IaC, monitoring, observability, SRE concepts, GitOps, and DevSecOps.",
    icon: Server,
    color: "emerald",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    glow: "hover:shadow-emerald-500/10",
    counts: { beginner: 5, intermediate: 4, advanced: 2 },
  },
  {
    slug: "cicd",
    label: "CI/CD",
    description: "GitHub Actions, Jenkins, ArgoCD, pipeline design, caching, secrets, and progressive delivery.",
    icon: GitBranch,
    color: "cyan",
    gradient: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-500/20 hover:border-cyan-500/50",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    glow: "hover:shadow-cyan-500/10",
    counts: { beginner: 3, intermediate: 4, advanced: 3 },
  },
]

const difficultyColors = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
}

export default function InterviewPrepPage() {
  const totalQuestions = topics.reduce((sum, t) => sum + t.counts.beginner + t.counts.intermediate + t.counts.advanced, 0)

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

      {/* Difficulty legend */}
      <div className="container mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground">Difficulty:</span>
          {Object.entries(difficultyColors).map(([level, cls]) => (
            <span key={level} className={`px-3 py-1 rounded-full border text-xs font-medium capitalize ${cls}`}>
              {level}
            </span>
          ))}
        </div>
      </div>

      {/* Topics grid */}
      <section className="container mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => {
            const Icon = topic.icon
            const total = topic.counts.beginner + topic.counts.intermediate + topic.counts.advanced
            return (
              <Link
                key={topic.slug}
                href={`/interview-prep/${topic.slug}`}
                className={`group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${topic.border} ${topic.glow}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${topic.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${topic.iconBg} mb-4`}>
                    <Icon className={`h-5 w-5 ${topic.iconColor}`} />
                  </div>

                  <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {topic.label}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {topic.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyColors.beginner}`}>
                      {topic.counts.beginner} Beginner
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyColors.intermediate}`}>
                      {topic.counts.intermediate} Intermediate
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyColors.advanced}`}>
                      {topic.counts.advanced} Advanced
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{total} questions total</span>
                    <span className={`flex items-center gap-1 font-medium ${topic.iconColor} group-hover:gap-2 transition-all`}>
                      Start <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Coming soon card */}
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            More topics coming soon — Terraform, Linux, Networking, Helm, Monitoring & more.
          </p>
        </div>
      </section>
    </div>
  )
}
