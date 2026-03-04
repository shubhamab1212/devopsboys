"use client"

import { useState, useCallback } from "react"
import { Bug, Zap, RefreshCw, Lightbulb, CheckCircle2, XCircle, Trophy, Flame, MousePointerClick } from "lucide-react"

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

type GameState = "playing" | "correct" | "partial" | "wrong"

const DIFFICULTY_CONFIG = {
  easy:   { label: "Easy",   color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", points: 100 },
  medium: { label: "Medium", color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30",   points: 200 },
  hard:   { label: "Hard",   color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30",     points: 400 },
}

const TYPE_CONFIG = {
  dockerfile: { label: "Dockerfile",      icon: "🐳" },
  kubernetes: { label: "Kubernetes YAML", icon: "☸️" },
}

export default function BugFinderPage() {
  const [difficulty, setDifficulty]     = useState<Difficulty>("medium")
  const [type, setType]                 = useState<ChallengeType>("dockerfile")
  const [challenge, setChallenge]       = useState<Challenge | null>(null)
  const [loading, setLoading]           = useState(false)
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set())
  const [gameState, setGameState]       = useState<GameState>("playing")
  const [showHint, setShowHint]         = useState(false)
  const [revealed, setRevealed]         = useState(false)
  const [score, setScore]               = useState(0)
  const [streak, setStreak]             = useState(0)
  const [solved, setSolved]             = useState(0)
  const [error, setError]               = useState<string | null>(null)
  const [earnedPts, setEarnedPts]       = useState(0)

  const fetchChallenge = useCallback(async () => {
    setLoading(true)
    setChallenge(null)
    setSelectedLines(new Set())
    setGameState("playing")
    setShowHint(false)
    setRevealed(false)
    setError(null)
    setEarnedPts(0)

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
        setError(data.error ?? "Failed to load challenge.")
      }
    } catch {
      setError("Network error — could not reach the server.")
    } finally {
      setLoading(false)
    }
  }, [difficulty, type])

  const toggleLine = (lineNum: number) => {
    if (gameState !== "playing") return
    setSelectedLines(prev => {
      const next = new Set(prev)
      if (next.has(lineNum)) next.delete(lineNum)
      else next.add(lineNum)
      return next
    })
  }

  const submitAnswer = () => {
    if (!challenge || selectedLines.size === 0) return

    const bugLines = new Set(challenge.bugs.map(b => b.line))
    const selected = Array.from(selectedLines)
    const correctHits = selected.filter(l => bugLines.has(l))
    const wrongHits   = selected.filter(l => !bugLines.has(l))
    const allFound    = correctHits.length === bugLines.size

    if (allFound && wrongHits.length === 0) {
      // Perfect
      const pts = DIFFICULTY_CONFIG[difficulty].points
      setEarnedPts(pts)
      setScore(s => s + pts)
      setSolved(s => s + 1)
      setStreak(s => s + 1)
      setGameState("correct")
    } else if (allFound && wrongHits.length > 0) {
      // Found all bugs but also clicked wrong lines
      const pts = Math.round(DIFFICULTY_CONFIG[difficulty].points * 0.5)
      setEarnedPts(pts)
      setScore(s => s + pts)
      setSolved(s => s + 1)
      setStreak(s => s + 1)
      setGameState("partial")
    } else if (correctHits.length > 0) {
      // Found some bugs
      const pts = Math.round(DIFFICULTY_CONFIG[difficulty].points * 0.25)
      setEarnedPts(pts)
      setScore(s => s + pts)
      setStreak(0)
      setGameState("partial")
    } else {
      // All wrong
      setStreak(0)
      setGameState("wrong")
    }
    setRevealed(true)
  }

  const codeLines = challenge?.code.split("\n") ?? []
  const bugLines  = new Set(challenge?.bugs.map(b => b.line) ?? [])

  const getLineStyle = (lineNum: number) => {
    const isSelected = selectedLines.has(lineNum)
    const isBug      = bugLines.has(lineNum)

    if (revealed) {
      if (isBug && isSelected)  return "bg-emerald-500/15 border-l-2 border-emerald-400" // correct hit
      if (isBug && !isSelected) return "bg-red-500/15 border-l-2 border-red-400"          // missed bug
      if (!isBug && isSelected) return "bg-orange-500/10 border-l-2 border-orange-400"    // wrong selection
      return "hover:bg-white/[0.02]"
    }
    if (isSelected) return "bg-blue-500/15 border-l-2 border-blue-400"
    return "hover:bg-white/[0.03] cursor-pointer"
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl animate-float-delayed" />

        <div className="relative container mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium mb-5">
            <Bug className="h-4 w-4" />
            Click the Buggy Line
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Bug Finder
            </span>
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Find the bug by clicking the line with the mistake. Get it right — earn points.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-1.5 text-sm">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-muted-foreground">Score:</span>
              <span className="font-bold text-amber-400">{score}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-muted-foreground">Streak:</span>
              <span className="font-bold text-orange-400">{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-muted-foreground">Solved:</span>
              <span className="font-bold text-emerald-400">{solved}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 pb-20 space-y-4">

        {/* Controls */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
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
                          ? `${cfg.bg} ${cfg.border} ${cfg.color}`
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
                {(Object.entries(TYPE_CONFIG) as [ChallengeType, { label: string; icon: string }][]).map(([key, cfg]) => (
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
              <><RefreshCw className="h-4 w-4 animate-spin" /> Loading challenge…</>
            ) : (
              <><Zap className="h-4 w-4" />{challenge ? "New Challenge" : "Start Challenge"}</>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-sm text-red-300">
            <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Challenge */}
        {challenge && (
          <div className="space-y-4 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">{challenge.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {TYPE_CONFIG[type].icon} {TYPE_CONFIG[type].label}
                  {" · "}{DIFFICULTY_CONFIG[difficulty].label}
                  {" · "}{challenge.bugs.length} bug{challenge.bugs.length > 1 ? "s" : ""} hidden
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${DIFFICULTY_CONFIG[difficulty].bg} ${DIFFICULTY_CONFIG[difficulty].border} ${DIFFICULTY_CONFIG[difficulty].color}`}>
                +{DIFFICULTY_CONFIG[difficulty].points} pts
              </span>
            </div>

            {/* Instruction */}
            {gameState === "playing" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground/70 bg-blue-500/5 border border-blue-500/15 rounded-lg px-3 py-2">
                <MousePointerClick className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                Click the line(s) where you think the bug is, then hit Submit
                {challenge.bugs.length > 1 && <span className="text-amber-400 ml-1">— {challenge.bugs.length} bugs total</span>}
              </div>
            )}

            {/* Code block */}
            <div className="rounded-xl border border-border/50 bg-[#0d1117] overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/30 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  {type === "dockerfile" ? "Dockerfile" : "deployment.yaml"}
                </span>
                {selectedLines.size > 0 && gameState === "playing" && (
                  <span className="ml-auto text-xs text-blue-400">
                    {selectedLines.size} line{selectedLines.size > 1 ? "s" : ""} selected
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-sm">
                  <tbody>
                    {codeLines.map((line, i) => {
                      const lineNum = i + 1
                      const isSelected = selectedLines.has(lineNum)
                      const isBugLine  = bugLines.has(lineNum)

                      // Label after reveal
                      let revealLabel = null
                      if (revealed) {
                        if (isBugLine && isSelected)  revealLabel = <span className="ml-3 text-[10px] text-emerald-400 font-sans">✓ bug found</span>
                        if (isBugLine && !isSelected) revealLabel = <span className="ml-3 text-[10px] text-red-400 font-sans">← bug here</span>
                        if (!isBugLine && isSelected) revealLabel = <span className="ml-3 text-[10px] text-orange-400 font-sans">✗ wrong line</span>
                      }

                      return (
                        <tr
                          key={i}
                          onClick={() => toggleLine(lineNum)}
                          className={`group transition-colors duration-100 select-none ${getLineStyle(lineNum)} ${gameState === "playing" ? "cursor-pointer" : ""}`}
                        >
                          <td className="w-10 text-right pr-3 pl-3 py-0.5 text-muted-foreground/40 text-xs border-r border-border/20 shrink-0">
                            {lineNum}
                          </td>
                          <td className="pl-4 pr-4 py-0.5 whitespace-pre text-slate-300">
                            {line || " "}
                            {revealLabel}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hint */}
            {gameState === "playing" && (
              <button
                onClick={() => setShowHint(h => !h)}
                className="flex items-center gap-2 text-sm text-amber-400/70 hover:text-amber-400 transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                {showHint ? "Hide hint" : "Show hint"}
              </button>
            )}
            {showHint && (
              <div className="flex items-start gap-3 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm text-amber-200/80">
                <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                {challenge.hint}
              </div>
            )}

            {/* Submit button */}
            {gameState === "playing" && (
              <button
                onClick={submitAnswer}
                disabled={selectedLines.size === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            )}

            {/* Result */}
            {gameState !== "playing" && (
              <div className={`rounded-xl border p-5 space-y-4 ${
                gameState === "correct" ? "border-emerald-500/30 bg-emerald-500/5"
                : gameState === "partial" ? "border-amber-500/30 bg-amber-500/5"
                : "border-red-500/30 bg-red-500/5"
              }`}>
                <div className="flex items-start gap-3">
                  {gameState === "correct" ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : gameState === "partial" ? (
                    <CheckCircle2 className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold ${gameState === "correct" ? "text-emerald-400" : gameState === "partial" ? "text-amber-400" : "text-red-400"}`}>
                      {gameState === "correct" ? "Correct!" : gameState === "partial" ? "Partially correct!" : "Wrong line!"}
                      {earnedPts > 0 && <span className="ml-2 text-xs opacity-70">+{earnedPts} pts</span>}
                    </p>

                    {/* Bug details */}
                    <div className="mt-3 space-y-2">
                      {challenge.bugs.map((bug, i) => (
                        <div key={i} className="p-3 rounded-lg bg-background/50 border border-border/30 text-sm space-y-1">
                          <p className="font-mono text-xs text-red-400">Line {bug.line}</p>
                          <p className="text-foreground/80">{bug.description}</p>
                          <p className="text-emerald-400/80 text-xs">Fix: {bug.fix}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 italic">{challenge.explanation}</p>
                  </div>
                </div>

                {/* Next */}
                <button
                  onClick={fetchChallenge}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50 hover:border-violet-500/40 hover:bg-violet-500/5 text-sm font-medium text-muted-foreground hover:text-violet-400 transition-all duration-200"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Loading…" : "Next Challenge →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!challenge && !loading && !error && (
          <div className="text-center py-20 text-muted-foreground">
            <MousePointerClick className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium opacity-50">Pick difficulty & type, then start</p>
            <p className="text-sm opacity-30 mt-1">Click the buggy line to win</p>
          </div>
        )}
      </div>
    </main>
  )
}
