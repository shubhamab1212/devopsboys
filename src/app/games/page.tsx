import Link from "next/link"
import { Bug, Gamepad2, ChevronRight, Zap } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Games | DevOpsBoys",
  description: "Learn DevOps by playing. AI-powered games that test your real-world skills.",
}

const games = [
  {
    href: "/games/bug-finder",
    icon: Bug,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    borderColor: "border-red-500/20",
    glowColor: "hover:border-red-500/40 hover:shadow-red-500/10",
    badge: "Live",
    badgeColor: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
    title: "Bug Finder",
    description: "Spot bugs in real Dockerfiles, Kubernetes YAMLs, and CI/CD pipelines. AI generates a unique challenge every time.",
    tags: ["Dockerfile", "Kubernetes", "GitHub Actions", "Docker Compose"],
    tagColor: "bg-slate-800 text-slate-300",
  },
]

const comingSoon = [
  {
    icon: "🏗️",
    title: "Config Builder",
    description: "Build a correct config from scratch. AI evaluates your solution.",
  },
  {
    icon: "🔐",
    title: "Security Audit",
    description: "Find security vulnerabilities in infrastructure configs.",
  },
  {
    icon: "🚨",
    title: "Incident Simulator",
    description: "Diagnose and fix a broken production system in real time.",
  },
]

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="absolute top-10 left-1/3 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/3 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />

        <div className="relative container mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium mb-6">
            <Gamepad2 className="h-4 w-4" />
            Learn by Doing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              DevOps Games
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Sharpen your skills with AI-powered challenges. Each game generates real-world scenarios — no repetition, no memorization.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 pb-20">

        {/* Live games */}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Play Now
        </h2>
        <div className="grid gap-4 mb-12">
          {games.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className={`group relative rounded-2xl border ${game.borderColor} ${game.glowColor} bg-card/50 p-6 hover:shadow-lg transition-all duration-200 backdrop-blur-sm`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${game.iconBg} flex items-center justify-center shrink-0`}>
                  <game.icon className={`h-6 w-6 ${game.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-foreground">{game.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${game.badgeColor}`}>
                      {game.badge}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{game.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {game.tags.map(tag => (
                      <span key={tag} className={`text-[11px] px-2 py-0.5 rounded-md ${game.tagColor}`}>
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

        {/* Coming soon */}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap className="h-3.5 w-3.5" />
          Coming Soon
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {comingSoon.map((game) => (
            <div
              key={game.title}
              className="rounded-2xl border border-border/30 bg-card/30 p-5 opacity-60"
            >
              <div className="text-2xl mb-3">{game.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{game.title}</h3>
              <p className="text-muted-foreground text-xs">{game.description}</p>
              <span className="inline-block mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/50 bg-border/20 text-muted-foreground">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
