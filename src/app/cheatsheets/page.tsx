import type { Metadata } from "next"
import Link from "next/link"
import { Terminal, Container, Layers, Cloud, GitBranch, ChevronRight, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "DevOps Cheatsheets",
  description: "Quick reference cheatsheets for Docker, Kubernetes, AWS CLI, and Git — copy-paste ready commands.",
}

const cheatsheets = [
  {
    slug: "docker",
    label: "Docker",
    description: "Container lifecycle, images, volumes, networking, Compose, and cleanup commands.",
    icon: Container,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    border: "border-blue-500/20 hover:border-blue-500/50",
    gradient: "from-blue-500/10 to-transparent",
    sections: 6,
    commands: 55,
  },
  {
    slug: "kubernetes",
    label: "Kubernetes",
    description: "kubectl commands for pods, deployments, services, config, RBAC, and debugging.",
    icon: Layers,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    border: "border-violet-500/20 hover:border-violet-500/50",
    gradient: "from-violet-500/10 to-transparent",
    sections: 7,
    commands: 65,
  },
  {
    slug: "aws",
    label: "AWS CLI",
    description: "IAM, EC2, S3, EKS, Lambda, and CloudWatch Logs — production-ready AWS commands.",
    icon: Cloud,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    border: "border-orange-500/20 hover:border-orange-500/50",
    gradient: "from-orange-500/10 to-transparent",
    sections: 7,
    commands: 56,
  },
  {
    slug: "git",
    label: "Git",
    description: "Daily workflow, branching, remote operations, undo, stash, tags, and advanced tricks.",
    icon: GitBranch,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    gradient: "from-emerald-500/10 to-transparent",
    sections: 6,
    commands: 57,
  },
]

const comingSoon = ["Terraform", "Helm", "Linux", "Nginx", "Prometheus"]

export default function CheatsheetLandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-600/10 to-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-violet-600/8 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Terminal className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Cheatsheets</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            DevOps{" "}
            <span className="text-shimmer bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Command Reference
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Copy-paste ready commands for Docker, Kubernetes, AWS CLI, and Git.
            Every command you actually need — no fluff.
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              { dot: "bg-blue-400",    label: `${cheatsheets.length} Cheatsheets` },
              { dot: "bg-emerald-400", label: `${cheatsheets.reduce((s, c) => s + c.commands, 0)}+ Commands` },
              { dot: "bg-violet-400",  label: "Copy-paste ready" },
              { dot: "bg-yellow-400",  label: "100% Free" },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="container mx-auto max-w-5xl px-4 py-12 pb-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {cheatsheets.map((cs) => {
            const Icon = cs.icon
            return (
              <Link
                key={cs.slug}
                href={`/cheatsheets/${cs.slug}`}
                className={`group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cs.border}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cs.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cs.iconBg} mb-4`}>
                    <Icon className={`h-5 w-5 ${cs.iconColor}`} />
                  </div>

                  <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {cs.label}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {cs.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {cs.sections} sections
                      </span>
                      <span className="flex items-center gap-1">
                        <Terminal className="h-3.5 w-3.5" />
                        {cs.commands}+ commands
                      </span>
                    </div>
                    <span className={`flex items-center gap-1 font-medium ${cs.iconColor} group-hover:gap-2 transition-all`}>
                      Open <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Coming soon */}
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-card/50 p-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">Coming soon:</p>
          <div className="flex flex-wrap gap-2">
            {comingSoon.map((name) => (
              <span key={name} className="px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
