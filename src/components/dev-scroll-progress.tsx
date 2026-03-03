"use client"

import { useEffect, useState } from "react"

const STEPS = [
  { at: 8,  progress: 12, msg: "$ installing docker..." },
  { at: 18, progress: 25, msg: "$ pulling kubernetes images..." },
  { at: 30, progress: 38, msg: "$ kubectl apply -f brain.yaml" },
  { at: 42, progress: 52, msg: "$ sudo rm -rf work-life-balance" },
  { at: 55, progress: 65, msg: "$ git push --force (career)" },
  { at: 68, progress: 78, msg: "$ deploying to prod at 5pm Friday 🚀" },
  { at: 82, progress: 90, msg: "$ npm install caffeine --save" },
  { at: 95, progress: 100, msg: "✅ DevOps skills: INSTALLED" },
]

function getBar(progress: number) {
  const filled = Math.floor(progress / 10)
  return "█".repeat(filled) + "░".repeat(10 - filled)
}

export function DevScrollProgress() {
  const [scrollPct, setScrollPct] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
      setScrollPct(pct)
      setVisible(pct > 5 && pct < 97)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const step = STEPS.reduce((best, s) => (scrollPct >= s.at ? s : best), STEPS[0])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-6 z-50 hidden lg:block animate-fade-up">
      <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-sm px-4 py-3 shadow-xl max-w-[270px]">
        {/* Terminal title bar */}
        <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-border/60">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[10px] text-muted-foreground font-mono">devopsboys — bash</span>
        </div>
        {/* Command */}
        <p className="font-mono text-[11px] text-foreground mb-1.5 leading-snug">{step.msg}</p>
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-emerald-400 tracking-tight">[{getBar(step.progress)}]</span>
          <span className="font-mono text-[11px] text-muted-foreground">{step.progress}%</span>
        </div>
      </div>
    </div>
  )
}
