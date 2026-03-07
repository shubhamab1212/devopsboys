import Link from "next/link"
import { Wrench, ChevronRight, CheckSquare, Clock, Calculator, FileCode, DollarSign, Zap } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DevOps Tools | DevOpsBoys",
  description: "Free browser-based DevOps tools. Validate YAML, explain cron expressions, calculate Kubernetes resources, lint Dockerfiles, and estimate your DevOps salary.",
}

const tools = [
  {
    href: "/devtools/yaml-validator",
    icon: CheckSquare,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    glowColor: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    title: "YAML Validator",
    description: "Paste any Kubernetes manifest, Docker Compose file, or CI/CD config — get instant validation with line-by-line error details.",
    tags: ["Kubernetes", "Docker Compose", "GitHub Actions"],
  },
  {
    href: "/devtools/cron-explainer",
    icon: Clock,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    glowColor: "hover:border-blue-500/40 hover:shadow-blue-500/10",
    title: "Cron Expression Explainer",
    description: "Type any cron expression and get a plain English explanation plus the next 5 scheduled run times. Never guess a schedule again.",
    tags: ["CI/CD", "Scheduling", "Linux"],
  },
  {
    href: "/devtools/k8s-calculator",
    icon: Calculator,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    glowColor: "hover:border-violet-500/40 hover:shadow-violet-500/10",
    title: "Kubernetes Resource Calculator",
    description: "Input your app requirements and get recommended CPU/memory requests and limits — with copy-ready YAML output.",
    tags: ["Kubernetes", "Resource Management", "HPA"],
  },
  {
    href: "/devtools/dockerfile-linter",
    icon: FileCode,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    glowColor: "hover:border-orange-500/40 hover:shadow-orange-500/10",
    title: "Dockerfile Linter",
    description: "Paste your Dockerfile and get a security + best practices audit. Catches root user, unpinned tags, layer cache busting, and more.",
    tags: ["Docker", "Security", "Best Practices"],
  },
  {
    href: "/devtools/salary-calculator",
    icon: DollarSign,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    glowColor: "hover:border-pink-500/40 hover:shadow-pink-500/10",
    title: "DevOps Salary Calculator",
    description: "Select your role, experience level, skills, and location to get a realistic salary range based on 2026 market data.",
    tags: ["Career", "Salary", "DevOps", "SRE"],
  },
]

export default function DevToolsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />

        <div className="relative container mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
            <Wrench className="h-4 w-4" />
            100% Free — No Sign-up Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              DevOps Tools
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Browser-based tools built for DevOps engineers. No installs, no accounts, no nonsense — just paste and get results.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 pb-20">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap className="h-3.5 w-3.5" />
          Available Tools
        </h2>
        <div className="grid gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative rounded-2xl border ${tool.borderColor} ${tool.glowColor} bg-card/50 p-6 hover:shadow-lg transition-all duration-200 backdrop-blur-sm`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center shrink-0`}>
                  <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-foreground mb-1">{tool.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{tool.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.tags.map(tag => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* More coming soon */}
        <p className="text-center text-muted-foreground text-sm mt-10">
          More tools coming soon — Terraform validator, Docker Compose linter, K8s cost estimator.
        </p>
      </div>
    </main>
  )
}
