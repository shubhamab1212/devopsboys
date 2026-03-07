"use client"

import { useState } from "react"
import { DollarSign, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"

// 2026 market data (USD equivalent, annual)
const BASE_SALARY: Record<string, { min: number; max: number; currency: string; symbol: string }> = {
  us:        { min: 90000,  max: 180000, currency: "USD", symbol: "$" },
  uk:        { min: 55000,  max: 110000, currency: "GBP", symbol: "£" },
  germany:   { min: 55000,  max: 100000, currency: "EUR", symbol: "€" },
  canada:    { min: 75000,  max: 145000, currency: "CAD", symbol: "CA$" },
  australia: { min: 90000,  max: 155000, currency: "AUD", symbol: "A$" },
  india:     { min: 800000, max: 2500000, currency: "INR", symbol: "₹" },
  singapore: { min: 70000,  max: 140000, currency: "SGD", symbol: "S$" },
  uae:       { min: 140000, max: 300000, currency: "AED", symbol: "AED" },
}

const EXP_MULTIPLIER: Record<string, number> = {
  "0-1":  0.65,
  "1-3":  0.85,
  "3-5":  1.0,
  "5-8":  1.25,
  "8+":   1.55,
}

const ROLE_MULTIPLIER: Record<string, number> = {
  devops:       1.0,
  sre:          1.1,
  platform:     1.2,
  devsecops:    1.15,
  mlops:        1.25,
  cloudarch:    1.35,
}

const SKILL_BONUS: Record<string, number> = {
  kubernetes:  0.08,
  terraform:   0.07,
  aws:         0.07,
  gcp:         0.06,
  azure:       0.06,
  python:      0.05,
  golang:      0.09,
  rust:        0.08,
  security:    0.08,
  mlops:       0.10,
  argocd:      0.04,
  helm:        0.03,
  prometheus:  0.04,
  cicd:        0.05,
}

function formatSalary(amount: number, symbol: string, isInr: boolean): string {
  if (isInr) {
    if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)}L`
    return `${symbol}${(amount / 1000).toFixed(0)}K`
  }
  if (amount >= 1000000) return `${symbol}${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(0)}K`
  return `${symbol}${amount}`
}

export default function SalaryCalculatorPage() {
  const [location, setLocation] = useState("us")
  const [experience, setExperience] = useState("3-5")
  const [role, setRole] = useState("devops")
  const [skills, setSkills] = useState<string[]>(["kubernetes", "aws"])

  const toggleSkill = (skill: string) =>
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])

  const base = BASE_SALARY[location]
  const expMult = EXP_MULTIPLIER[experience]
  const roleMult = ROLE_MULTIPLIER[role]
  const skillBonus = skills.reduce((acc, s) => acc + (SKILL_BONUS[s] ?? 0), 0)
  const totalMult = expMult * roleMult * (1 + Math.min(skillBonus, 0.50))
  const isInr = location === "india"

  const minSalary = Math.round(base.min * totalMult)
  const maxSalary = Math.round(base.max * totalMult)
  const midSalary = Math.round((minSalary + maxSalary) / 2)

  const ROLES = [
    { id: "devops",    label: "DevOps Engineer" },
    { id: "sre",       label: "SRE" },
    { id: "platform",  label: "Platform Engineer" },
    { id: "devsecops", label: "DevSecOps Engineer" },
    { id: "mlops",     label: "MLOps Engineer" },
    { id: "cloudarch", label: "Cloud Architect" },
  ]

  const EXPERIENCES = ["0-1", "1-3", "3-5", "5-8", "8+"]

  const ALL_SKILLS = [
    { id: "kubernetes", label: "Kubernetes" },
    { id: "terraform",  label: "Terraform" },
    { id: "aws",        label: "AWS" },
    { id: "gcp",        label: "GCP" },
    { id: "azure",      label: "Azure" },
    { id: "python",     label: "Python" },
    { id: "golang",     label: "Go" },
    { id: "rust",       label: "Rust" },
    { id: "security",   label: "Security/DevSecOps" },
    { id: "mlops",      label: "MLOps" },
    { id: "argocd",     label: "ArgoCD / GitOps" },
    { id: "helm",       label: "Helm" },
    { id: "prometheus", label: "Prometheus / Grafana" },
    { id: "cicd",       label: "CI/CD (GitHub Actions / Jenkins)" },
  ]

  const LOCATIONS = [
    { id: "us",        label: "United States 🇺🇸" },
    { id: "uk",        label: "United Kingdom 🇬🇧" },
    { id: "germany",   label: "Germany 🇩🇪" },
    { id: "canada",    label: "Canada 🇨🇦" },
    { id: "australia", label: "Australia 🇦🇺" },
    { id: "singapore", label: "Singapore 🇸🇬" },
    { id: "uae",       label: "UAE 🇦🇪" },
    { id: "india",     label: "India 🇮🇳" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <Link href="/devtools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          All Tools
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs font-medium mb-4">
            <DollarSign className="h-3.5 w-3.5" />
            2026 Market Data
          </div>
          <h1 className="text-3xl font-bold mb-2">DevOps Salary Calculator</h1>
          <p className="text-muted-foreground">Get a realistic salary estimate based on your role, experience, skills, and location — updated for 2026 market rates.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left inputs — 3 cols */}
          <div className="lg:col-span-3 space-y-5">

            {/* Location */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Location</p>
              <div className="grid grid-cols-2 gap-2">
                {LOCATIONS.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => setLocation(loc.id)}
                    className={`text-sm px-3 py-2 rounded-xl border text-left transition-all ${location === loc.id ? "border-pink-500/60 bg-pink-500/10 text-pink-300" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Role */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Role</p>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`text-sm px-3 py-2 rounded-xl border text-left transition-all ${role === r.id ? "border-violet-500/60 bg-violet-500/10 text-violet-300" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Years of Experience</p>
              <div className="flex gap-2">
                {EXPERIENCES.map(exp => (
                  <button
                    key={exp}
                    onClick={() => setExperience(exp)}
                    className={`flex-1 text-sm py-2 rounded-xl border transition-all font-medium ${experience === exp ? "border-blue-500/60 bg-blue-500/10 text-blue-300" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Skills <span className="text-muted-foreground/60 font-normal normal-case">(each adds a salary premium)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${skills.includes(skill.id) ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}
                  >
                    {skill.label}
                    {skills.includes(skill.id) && <span className="ml-1 opacity-70">+{Math.round((SKILL_BONUS[skill.id] ?? 0) * 100)}%</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Result — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main salary display */}
            <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-violet-500/5 p-6 text-center sticky top-24">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Estimated Annual Salary</p>
              <p className="text-muted-foreground text-sm mb-4">{base.currency}</p>

              <div className="mb-2">
                <p className="text-5xl font-bold font-mono text-foreground">
                  {formatSalary(midSalary, base.symbol, isInr)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">median estimate</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-3 mb-6">
                <span className="text-emerald-400 font-mono font-semibold">{formatSalary(minSalary, base.symbol, isInr)}</span>
                <span>—</span>
                <span className="text-violet-400 font-mono font-semibold">{formatSalary(maxSalary, base.symbol, isInr)}</span>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Base range</span>
                  <span className="font-mono text-foreground">{formatSalary(base.min, base.symbol, isInr)} – {formatSalary(base.max, base.symbol, isInr)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Experience multiplier</span>
                  <span className="font-mono text-blue-400">{expMult}x</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Role premium</span>
                  <span className="font-mono text-violet-400">{roleMult}x</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Skills bonus</span>
                  <span className="font-mono text-emerald-400">+{Math.round(Math.min(skillBonus, 0.5) * 100)}%</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/30">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
                  <TrendingUp className="h-3 w-3 text-pink-400" />
                  Based on 2026 job market data
                </div>
                <p className="text-[11px] text-muted-foreground/50 mt-1">Estimates only. Actual salary depends on company size, negotiation, and location within country.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
