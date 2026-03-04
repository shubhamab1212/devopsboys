"use client"

import { useState, useCallback } from "react"
import { Bug, Zap, RefreshCw, ChevronRight, Lightbulb, CheckCircle2, XCircle, Trophy, Flame } from "lucide-react"

type Difficulty = "easy" | "medium" | "hard"
type ChallengeType = "dockerfile" | "kubernetes"

interface BugInfo {
  line: number
  description: string
  fix: string
}

interface Challenge {
  title: string
  code: string
  bugs: BugInfo[]
  hint: string
  explanation: string
}

interface ValidationResult {
  correct: boolean
  partial: boolean
  score: number
  feedback: string
}

const DIFFICULTY_CONFIG = {
  easy:   { label: "Easy",   color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-emerald-500/20", points: 100 },
  medium: { label: "Medium", color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30",   glow: "shadow-amber-500/20",   points: 200 },
  hard:   { label: "Hard",   color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30",     glow: "shadow-red-500/20",     points: 400 },
}

const TYPE_CONFIG = {
  dockerfile:  { label: "Dockerfile",      icon: "🐳", color: "text-blue-400" },
  kubernetes:  { label: "Kubernetes YAML", icon: "☸️", color: "text-violet-400" },
}

export default function BugFinderPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [type, setType]             = useState<ChallengeType>("dockerfile")
  const [challenge, setChallenge]   = useState<Challenge | null>(null)
  const [loading, setLoading]       = useState(false)
  const [answer, setAnswer]         = useState("")
  const [validating, setValidating] = useState(false)
  const [result, setResult]         = useState<ValidationResult | null>(null)
  const [showHint, setShowHint]     = useState(false)
  const [revealed, setRevealed]     = useState(false)
  const [score, setScore]           = useState(0)
  const [streak, setStreak]         = useState(0)
  const [solved, setSolved]         = useState(0)
  const [error, setError]           = useState<string | null>(null)

  const fetchChallenge = useCallback(async () => {
    setLoading(true)
    setChallenge(null)
    setAnswer("")
    setResult(null)
    setShowHint(false)
    setRevealed(false)
    setError(null)

    try {
      const res = await fetch("/api/games/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, type }),
      })
      const data = await res.json()
      if (data.challenge) {
        setChallenge(data.challenge)
      } else {
        setError(data.error ?? "Failed to generate challenge. Check if ANTHROPIC_API_KEY is set.")
      }
    } catch (e) {
      setError("Network error — could not reach the API.")
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [difficulty, type])

  const submitAnswer = async () => {
    if (!challenge || !answer.trim()) return
    setValidating(true)
    try {
      const res = await fetch("/api/games/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnswer: answer, challenge }),
      })
      const data: ValidationResult = await res.json()
      setResult(data)
      if (data.correct || data.partial) {
        const pts = Math.round((data.score / 100) * DIFFICULTY_CONFIG[difficulty].points)
        setScore(s => s + pts)
        setSolved(s => s + 1)
        setStreak(s => s + 1)
      } else {
        setStreak(0)
      }
    } catch {
      // silently fail
    } finally {
      setValidating(false)
    }
  }

  const codeLines = challenge?.code.split("\n") ?? []

  const bugLines = new Set(challenge?.bugs.map(b => b.line) ?? [])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl animate-float-delayed" />

        <div className="relative container mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium mb-6">
            <Bug className="h-4 w-4" />
            AI-Powered Challenge
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Bug Finder
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find bugs in real-world DevOps configs. AI generates a new challenge every time — no two are the same.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-muted-foreground">Score:</span>
              <span className="font-bold text-amber-400">{score}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-muted-foreground">Streak:</span>
              <span className="font-bold text-orange-400">{streak}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-muted-foreground">Solved:</span>
              <span className="font-bold text-emerald-400">{solved}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 pb-20">

        {/* Controls */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-5 mb-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Difficulty */}
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">Difficulty</p>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as Difficulty[]).map(d => {
                  const cfg = DIFFICULTY_CONFIG[d]
                  return (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                        difficulty === d
                          ? `${cfg.bg} ${cfg.border} ${cfg.color} shadow-sm ${cfg.glow}`
                          : "border-border/50 text-muted-foreground hover:border-border"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Type */}
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">Challenge Type</p>
              <div className="flex gap-2">
                {(Object.entries(TYPE_CONFIG) as [ChallengeType, typeof TYPE_CONFIG[keyof typeof TYPE_CONFIG]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setType(key)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 ${
                      type === key
                        ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                        : "border-border/50 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <span className="text-base">{cfg.icon}</span>
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={fetchChallenge}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-semibold text-sm shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating challenge…
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                {challenge ? "New Challenge" : "Generate Challenge"}
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Challenge */}
        {challenge && (
          <div className="space-y-4 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>

            {/* Challenge header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">{challenge.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {TYPE_CONFIG[type].icon} {TYPE_CONFIG[type].label} &middot; {DIFFICULTY_CONFIG[difficulty].label}
                  {" "}&middot; {challenge.bugs.length} bug{challenge.bugs.length > 1 ? "s" : ""} hidden
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${DIFFICULTY_CONFIG[difficulty].bg} ${DIFFICULTY_CONFIG[difficulty].border} ${DIFFICULTY_CONFIG[difficulty].color}`}>
                +{DIFFICULTY_CONFIG[difficulty].points} pts
              </span>
            </div>

            {/* Code block */}
            <div className="rounded-xl border border-border/50 bg-[#0d1117] overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/30 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  {type === "dockerfile" ? "Dockerfile" : "deployment.yaml"}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-sm">
                  <tbody>
                    {codeLines.map((line, i) => {
                      const lineNum = i + 1
                      const isBug = revealed && bugLines.has(lineNum)
                      return (
                        <tr
                          key={i}
                          className={`group ${isBug ? "bg-red-500/10" : "hover:bg-white/[0.02]"}`}
                        >
                          <td className="select-none w-10 text-right pr-4 pl-3 py-0.5 text-muted-foreground/40 text-xs border-r border-border/20">
                            {lineNum}
                          </td>
                          <td className={`pl-4 pr-4 py-0.5 whitespace-pre ${isBug ? "text-red-300" : "text-slate-300"}`}>
                            {line || " "}
                            {isBug && <span className="ml-3 text-[10px] text-red-400/70 font-sans">← bug</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hint */}
            {!result && (
              <button
                onClick={() => setShowHint(h => !h)}
                className="flex items-center gap-2 text-sm text-amber-400/80 hover:text-amber-400 transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                {showHint ? "Hide hint" : "Show hint (−50 pts)"}
              </button>
            )}
            {showHint && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm text-amber-200/80">
                <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                {challenge.hint}
              </div>
            )}

            {/* Answer input */}
            {!result && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Describe the bug(s) you found:
                </label>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="e.g. Line 3 uses :latest tag which is not pinned to a specific version, causing unpredictable builds..."
                  rows={3}
                  className="w-full rounded-xl border border-border/50 bg-card/50 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 placeholder:text-muted-foreground/40 transition-all"
                />
                <button
                  onClick={submitAnswer}
                  disabled={validating || !answer.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validating ? "Checking with AI…" : "Submit Answer"}
                </button>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className={`rounded-xl border p-5 space-y-4 ${
                result.correct
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : result.partial
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-red-500/30 bg-red-500/5"
              }`}>
                <div className="flex items-center gap-3">
                  {result.correct ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  ) : result.partial ? (
                    <CheckCircle2 className="h-6 w-6 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400 shrink-0" />
                  )}
                  <div>
                    <p className={`font-semibold ${result.correct ? "text-emerald-400" : result.partial ? "text-amber-400" : "text-red-400"}`}>
                      {result.correct ? "Correct! Well spotted." : result.partial ? "Partially correct!" : "Not quite."}
                      {(result.correct || result.partial) && (
                        <span className="ml-2 text-xs opacity-70">
                          +{Math.round((result.score / 100) * DIFFICULTY_CONFIG[difficulty].points)} pts
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{result.feedback}</p>
                  </div>
                </div>

                {/* Show answer button */}
                {!revealed && (
                  <button
                    onClick={() => setRevealed(true)}
                    className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    Reveal bugs in code
                  </button>
                )}

                {/* Bug details */}
                {revealed && (
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bug Details</p>
                    {challenge.bugs.map((bug, i) => (
                      <div key={i} className="p-3 rounded-lg bg-background/50 border border-border/30 text-sm space-y-1">
                        <p className="font-mono text-xs text-red-400">Line {bug.line}</p>
                        <p className="text-foreground/80">{bug.description}</p>
                        <p className="text-emerald-400/80 text-xs">Fix: {bug.fix}</p>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground pt-1 italic">{challenge.explanation}</p>
                  </div>
                )}

                {/* Next challenge */}
                <button
                  onClick={fetchChallenge}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50 hover:border-violet-500/40 hover:bg-violet-500/5 text-sm font-medium text-muted-foreground hover:text-violet-400 transition-all duration-200"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Generating…" : "Next Challenge →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-sm text-red-300">
            <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 mb-0.5">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!challenge && !loading && !error && (
          <div className="text-center py-20 text-muted-foreground">
            <Bug className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium opacity-50">Pick difficulty &amp; type, then hit Generate</p>
            <p className="text-sm opacity-30 mt-1">AI will create a unique buggy config for you to debug</p>
          </div>
        )}
      </div>
    </main>
  )
}
