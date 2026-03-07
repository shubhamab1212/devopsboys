"use client"

import { useState } from "react"
import { Clock, ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"

interface CronField {
  name: string
  value: string
  explanation: string
  valid: boolean
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function explainField(value: string, type: "minute" | "hour" | "dom" | "month" | "dow"): { explanation: string; valid: boolean } {
  const max = { minute: 59, hour: 23, dom: 31, month: 12, dow: 7 }[type]
  const min = type === "dom" || type === "month" ? 1 : 0

  const label = { minute: "minute", hour: "hour", dom: "day of month", month: "month", dow: "day of week" }[type]

  if (value === "*") return { explanation: `Every ${label}`, valid: true }

  // Step: */n
  const stepMatch = value.match(/^\*\/(\d+)$/)
  if (stepMatch) {
    const step = parseInt(stepMatch[1])
    if (step <= 0 || step > max) return { explanation: `Invalid step value`, valid: false }
    if (type === "minute") return { explanation: `Every ${step} minutes`, valid: true }
    if (type === "hour") return { explanation: `Every ${step} hours`, valid: true }
    if (type === "dom") return { explanation: `Every ${step} days`, valid: true }
    if (type === "month") return { explanation: `Every ${step} months`, valid: true }
    if (type === "dow") return { explanation: `Every ${step} days of the week`, valid: true }
  }

  // Range: n-m
  const rangeMatch = value.match(/^(\d+)-(\d+)$/)
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1])
    const end = parseInt(rangeMatch[2])
    if (start < min || end > max || start > end) return { explanation: `Invalid range (valid: ${min}-${max})`, valid: false }
    if (type === "hour") return { explanation: `Hours ${start} to ${end} (${start}:00–${end}:59)`, valid: true }
    if (type === "dow") return { explanation: `${DAYS[start]} through ${DAYS[Math.min(end, 6)]}`, valid: true }
    if (type === "month") return { explanation: `${MONTHS[start - 1]} through ${MONTHS[end - 1]}`, valid: true }
    return { explanation: `${label} ${start} through ${end}`, valid: true }
  }

  // List: n,m,p
  const listMatch = value.match(/^[\d,]+$/)
  if (listMatch) {
    const parts = value.split(",").map(Number)
    for (const p of parts) {
      if (p < min || p > max) return { explanation: `Value ${p} out of range (${min}-${max})`, valid: false }
    }
    if (type === "dow") return { explanation: `${parts.map(p => DAYS[Math.min(p, 6)]).join(", ")}`, valid: true }
    if (type === "month") return { explanation: `${parts.map(p => MONTHS[p - 1]).join(", ")}`, valid: true }
    if (type === "hour") return { explanation: `At hour${parts.length > 1 ? "s" : ""} ${parts.join(", ")}`, valid: true }
    if (type === "minute") return { explanation: `At minute${parts.length > 1 ? "s" : ""} ${parts.join(", ")}`, valid: true }
    return { explanation: `On ${label}s: ${parts.join(", ")}`, valid: true }
  }

  // Single number
  const num = parseInt(value)
  if (!isNaN(num) && String(num) === value) {
    if (num < min || num > max) return { explanation: `Value ${num} out of range (${min}-${max})`, valid: false }
    if (type === "minute") return { explanation: `At minute :${String(num).padStart(2, "0")}`, valid: true }
    if (type === "hour") return { explanation: `At ${num}:00 (${num < 12 ? num === 0 ? "midnight" : `${num}am` : num === 12 ? "noon" : `${num - 12}pm`})`, valid: true }
    if (type === "dom") return { explanation: `On the ${num}${["st", "nd", "rd"][num - 1] || "th"} of the month`, valid: true }
    if (type === "month") return { explanation: `In ${MONTHS[num - 1]}`, valid: true }
    if (type === "dow") return { explanation: `On ${DAYS[Math.min(num, 6)]}`, valid: true }
  }

  return { explanation: `Unknown expression`, valid: false }
}

function getNextRuns(expr: string): string[] {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return []

  const now = new Date()
  const runs: string[] = []
  const check = new Date(now)
  check.setSeconds(0, 0)
  check.setMinutes(check.getMinutes() + 1)

  const [minStr, hrStr, domStr, monStr, dowStr] = parts

  const matches = (val: number, expr: string, min: number, max: number): boolean => {
    if (expr === "*") return true
    const step = expr.match(/^\*\/(\d+)$/)
    if (step) return (val - min) % parseInt(step[1]) === 0
    const range = expr.match(/^(\d+)-(\d+)$/)
    if (range) return val >= parseInt(range[1]) && val <= parseInt(range[2])
    if (/^[\d,]+$/.test(expr)) return expr.split(",").map(Number).includes(val)
    if (/^\d+$/.test(expr)) return val === parseInt(expr)
    return false
  }

  let iterations = 0
  while (runs.length < 5 && iterations < 100000) {
    iterations++
    const min = check.getMinutes()
    const hr = check.getHours()
    const dom = check.getDate()
    const mon = check.getMonth() + 1
    const dow = check.getDay()

    if (
      matches(min, minStr, 0, 59) &&
      matches(hr, hrStr, 0, 23) &&
      matches(dom, domStr, 1, 31) &&
      matches(mon, monStr, 1, 12) &&
      matches(dow, dowStr, 0, 6)
    ) {
      runs.push(check.toLocaleString("en-US", {
        weekday: "short", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true
      }))
    }
    check.setMinutes(check.getMinutes() + 1)
  }

  return runs
}

function parseCron(expr: string): { fields: CronField[]; summary: string; valid: boolean; nextRuns: string[] } {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) {
    return { fields: [], summary: "A cron expression must have exactly 5 fields.", valid: false, nextRuns: [] }
  }

  const types: Array<"minute" | "hour" | "dom" | "month" | "dow"> = ["minute", "hour", "dom", "month", "dow"]
  const names = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"]

  const fields: CronField[] = parts.map((val, i) => {
    const { explanation, valid } = explainField(val, types[i])
    return { name: names[i], value: val, explanation, valid }
  })

  const allValid = fields.every(f => f.valid)
  let summary = ""

  if (allValid) {
    const [min, hr, dom, mon, dow] = fields
    summary = `Runs ${hr.explanation.toLowerCase()}, ${min.explanation.toLowerCase()}`
    if (parts[2] !== "*") summary += `, ${dom.explanation.toLowerCase()}`
    if (parts[3] !== "*") summary += `, ${mon.explanation.toLowerCase()}`
    if (parts[4] !== "*") summary += `, ${dow.explanation.toLowerCase()}`
  }

  const nextRuns = allValid ? getNextRuns(expr) : []
  return { fields, summary, valid: allValid, nextRuns }
}

const PRESETS = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Daily at midnight", expr: "0 0 * * *" },
  { label: "Daily at 2 AM", expr: "0 2 * * *" },
  { label: "Every 15 minutes", expr: "*/15 * * * *" },
  { label: "Weekly (Sunday)", expr: "0 0 * * 0" },
  { label: "Monthly (1st)", expr: "0 0 1 * *" },
  { label: "Weekdays at 9 AM", expr: "0 9 * * 1-5" },
]

export default function CronExplainerPage() {
  const [input, setInput] = useState("0 2 * * *")
  const [copied, setCopied] = useState(false)

  const result = input.trim() ? parseCron(input) : null

  const copy = () => {
    navigator.clipboard.writeText(input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <Link href="/devtools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          All Tools
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-4">
            <Clock className="h-3.5 w-3.5" />
            Free Tool
          </div>
          <h1 className="text-3xl font-bold mb-2">Cron Expression Explainer</h1>
          <p className="text-muted-foreground">Type any cron expression to get a plain English explanation and the next 5 scheduled run times.</p>
        </div>

        {/* Input */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-6 mb-6">
          <label className="text-sm font-semibold text-foreground block mb-3">Cron Expression</label>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="* * * * *"
              className="flex-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 font-mono text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button onClick={copy} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          {/* Field labels */}
          <div className="grid grid-cols-5 gap-2 mt-3 font-mono text-[11px] text-muted-foreground text-center">
            {["minute", "hour", "dom", "month", "dow"].map(f => (
              <div key={f} className="bg-slate-800/50 rounded px-1 py-1">{f}</div>
            ))}
          </div>

          {/* Presets */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Common presets:</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.expr}
                  onClick={() => setInput(p.expr)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors font-mono"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Summary */}
            {result.valid && result.summary && (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-2">Plain English</p>
                <p className="text-lg text-foreground font-medium capitalize">{result.summary}</p>
              </div>
            )}

            {!result.valid && result.fields.length === 0 && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <p className="text-red-400">{result.summary}</p>
              </div>
            )}

            {/* Fields breakdown */}
            {result.fields.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 border-b border-border/50">Field Breakdown</p>
                <div className="divide-y divide-border/30">
                  {result.fields.map((field, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3">
                      <span className="font-mono text-base font-bold text-foreground w-12 shrink-0">{field.value}</span>
                      <span className="text-sm text-muted-foreground w-28 shrink-0">{field.name}</span>
                      <span className={`text-sm flex-1 ${field.valid ? "text-foreground" : "text-red-400"}`}>{field.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next runs */}
            {result.nextRuns.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 border-b border-border/50">Next 5 Runs (your local time)</p>
                <div className="divide-y divide-border/30">
                  {result.nextRuns.map((run, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                      <span className="font-mono text-sm text-foreground">{run}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
