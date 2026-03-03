"use client"

import { useEffect, useState } from "react"

const STAGES = [
  { at: 0,  emoji: "🤔", label: "What is DevOps?" },
  { at: 20, emoji: "📚", label: "Getting somewhere..." },
  { at: 40, emoji: "💡", label: "Ahh, now it clicks!" },
  { at: 60, emoji: "⚡", label: "Engineer mode: ON" },
  { at: 80, emoji: "🔥", label: "Senior DevOps vibes" },
  { at: 95, emoji: "🚀", label: "Brain: deployed ✅" },
]

export function DevScrollProgress() {
  const [pct, setPct] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const p = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
      setPct(p)
      setVisible(p > 5 && p < 97)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const stage = [...STAGES].reverse().find((s) => pct >= s.at) ?? STAGES[0]

  // SVG circle ring math
  const r = 26
  const circ = 2 * Math.PI * r
  const dash = circ * (pct / 100)
  const gap = circ - dash

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:flex flex-col items-center gap-1.5 animate-fade-up">
      {/* Circular progress ring */}
      <div className="relative w-[72px] h-[72px] drop-shadow-lg">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          {/* Track ring */}
          <circle
            cx="32" cy="32" r={r}
            fill="none"
            strokeWidth="5"
            className="stroke-border/60"
          />
          {/* Progress ring */}
          <circle
            cx="32" cy="32" r={r}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            stroke="url(#scroll-grad)"
            strokeDasharray={`${dash} ${gap}`}
          />
          <defs>
            <linearGradient id="scroll-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="oklch(0.65 0.2 250)" />
              <stop offset="100%" stopColor="oklch(0.70 0.22 290)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center: emoji + % */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-lg leading-none">{stage.emoji}</span>
          <span className="font-mono text-[9px] text-muted-foreground leading-none">{pct}%</span>
        </div>
      </div>

      {/* Label */}
      <span className="font-mono text-[9px] text-muted-foreground text-center max-w-[80px] leading-tight px-1.5 py-0.5 rounded bg-card/80 backdrop-blur-sm border border-border/50">
        {stage.label}
      </span>
    </div>
  )
}
