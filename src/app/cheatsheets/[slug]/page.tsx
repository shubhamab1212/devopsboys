import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Terminal } from "lucide-react"
import { CopyBtn } from "@/components/cheatsheet-copy-btn"
import fs from "fs"
import path from "path"

const SLUGS = ["docker", "kubernetes", "aws", "git", "terraform"]

interface Command { cmd: string; desc: string }
interface Section  { title: string; commands: Command[] }
interface Sheet    { slug: string; label: string; color: string; description: string; sections: Section[] }

const colorMap: Record<string, { badge: string; heading: string; dot: string }> = {
  blue:    { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",    heading: "text-blue-400",    dot: "bg-blue-500" },
  violet:  { badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", heading: "text-violet-400", dot: "bg-violet-500" },
  orange:  { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", heading: "text-orange-400", dot: "bg-orange-500" },
  emerald: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", heading: "text-emerald-400", dot: "bg-emerald-500" },
  cyan:    { badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",       heading: "text-cyan-400",    dot: "bg-cyan-500" },
}

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!SLUGS.includes(slug)) return {}
  const sheet: Sheet = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/cheatsheets", `${slug}.json`), "utf-8"))
  return {
    title: `${sheet.label} Cheatsheet — DevOpsBoys`,
    description: sheet.description,
  }
}

export default async function CheatsheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUGS.includes(slug)) notFound()

  const sheet: Sheet = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/cheatsheets", `${slug}.json`), "utf-8"))
  const cfg = colorMap[sheet.color] ?? colorMap.blue
  const totalCommands = sheet.sections.reduce((s, sec) => s + sec.commands.length, 0)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 py-10 relative">
          <Link
            href="/cheatsheets"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> All Cheatsheets
          </Link>

          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cfg.badge.split(" ")[0]} shrink-0`}>
              <Terminal className={`h-6 w-6 ${cfg.heading}`} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{sheet.label} Cheatsheet</h1>
              <p className="text-muted-foreground max-w-xl">{sheet.description}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className={`px-3 py-1 rounded-full border text-xs font-medium ${cfg.badge}`}>
                  {sheet.sections.length} sections
                </span>
                <span className={`px-3 py-1 rounded-full border text-xs font-medium ${cfg.badge}`}>
                  {totalCommands} commands
                </span>
                <span className="px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground">
                  Click any row to copy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOC sidebar + content */}
      <div className="container mx-auto max-w-5xl px-4 py-10 pb-20">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">

          {/* Sticky TOC (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Sections</p>
              <nav className="flex flex-col gap-1">
                {sheet.sections.map((sec) => (
                  <a
                    key={sec.title}
                    href={`#${sec.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1 group"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} opacity-50 group-hover:opacity-100 transition-opacity`} />
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <main className="space-y-10">
            {sheet.sections.map((sec) => {
              const anchor = sec.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
              return (
                <div key={sec.title} id={anchor}>
                  <h2 className={`text-lg font-bold mb-4 flex items-center gap-2.5 ${cfg.heading}`}>
                    <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot}`} />
                    {sec.title}
                  </h2>

                  <div className="rounded-xl border border-border overflow-hidden bg-card">
                    {sec.commands.map((command, i) => (
                      <div
                        key={i}
                        className="group/row flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors"
                      >
                        <code className="flex-1 font-mono text-sm text-foreground leading-snug break-all select-all">
                          {command.cmd}
                        </code>
                        <p className="hidden sm:block min-w-[160px] max-w-[280px] text-xs text-muted-foreground leading-snug pt-0.5">
                          {command.desc}
                        </p>
                        <CopyBtn text={command.cmd} />
                      </div>
                    ))}
                  </div>

                  {/* Mobile: show desc below cmd */}
                  <div className="sm:hidden mt-1 space-y-0">
                    {sec.commands.map((command, i) => (
                      <p key={i} className="text-xs text-muted-foreground px-4 py-1 border-b border-border/50 last:border-0">
                        {command.desc}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}
          </main>
        </div>
      </div>
    </div>
  )
}
