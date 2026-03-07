"use client"

import { useState } from "react"
import { CheckSquare, Copy, Check, AlertTriangle, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LintResult {
  line: number
  type: "error" | "warning" | "info"
  message: string
}

function validateYAML(input: string): { results: LintResult[]; valid: boolean } {
  const results: LintResult[] = []
  const lines = input.split("\n")

  lines.forEach((line, idx) => {
    const lineNum = idx + 1
    const trimmed = line.trimEnd()

    // Tab character check
    if (/\t/.test(trimmed)) {
      results.push({ line: lineNum, type: "error", message: "Tab character found — YAML requires spaces for indentation, not tabs." })
    }

    // Trailing spaces
    if (line !== trimmed && line.length > 0) {
      results.push({ line: lineNum, type: "info", message: "Trailing whitespace detected." })
    }

    // Unbalanced quotes
    const singleQuotes = (trimmed.match(/'/g) || []).length
    const doubleQuotes = (trimmed.match(/(?<!\\)"/g) || []).length
    if (singleQuotes % 2 !== 0) {
      results.push({ line: lineNum, type: "error", message: "Unbalanced single quotes — check your string values." })
    }
    if (doubleQuotes % 2 !== 0) {
      results.push({ line: lineNum, type: "error", message: "Unbalanced double quotes — check your string values." })
    }

    // Key without colon (non-comment, non-list, non-blank lines)
    if (trimmed.length > 0 && !trimmed.startsWith("#") && !trimmed.startsWith("-") && !trimmed.startsWith("|") && !trimmed.startsWith(">") && !trimmed.startsWith("---") && !trimmed.startsWith("...")) {
      if (/^[a-zA-Z_][a-zA-Z0-9_.\-/]*\s+[^:]/.test(trimmed) && !trimmed.includes(":")) {
        results.push({ line: lineNum, type: "warning", message: `Possible missing colon after key — did you mean "${trimmed.split(" ")[0]}:"?` })
      }
    }

    // Kubernetes specific: image using :latest
    if (/image:\s*.+:latest/.test(trimmed)) {
      results.push({ line: lineNum, type: "warning", message: 'Using ":latest" image tag — pin a specific version for reproducible deployments.' })
    }

    // Missing quotes around special YAML values
    if (/:\s+(yes|no|on|off|true|false)\s*$/.test(trimmed) && !trimmed.includes('"') && !trimmed.includes("'")) {
      const val = trimmed.match(/:\s+(yes|no|on|off|true|false)/)?.[1]
      if (val && ["yes", "no", "on", "off"].includes(val)) {
        results.push({ line: lineNum, type: "warning", message: `"${val}" is interpreted as a boolean in YAML. Wrap in quotes if you mean the string "${val}".` })
      }
    }

    // Kubernetes: runAsRoot or no securityContext
    if (/runAsNonRoot:\s*false/.test(trimmed)) {
      results.push({ line: lineNum, type: "warning", message: "runAsNonRoot: false — container will run as root. Consider setting to true for security." })
    }

    // Empty value with no quotes (might be intentional but flag it)
    if (/:\s*$/.test(trimmed) && !trimmed.startsWith("#") && !trimmed.startsWith("-")) {
      results.push({ line: lineNum, type: "info", message: "Empty value — if intentional, use null or \"\" to be explicit." })
    }

    // Odd indentation (YAML should use consistent multiples)
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0
    if (indent > 0 && indent % 2 !== 0) {
      results.push({ line: lineNum, type: "warning", message: `Indentation of ${indent} spaces — YAML conventionally uses 2-space indentation.` })
    }
  })

  // Check for duplicate top-level keys
  const topLevelKeys: string[] = []
  lines.forEach((line, idx) => {
    const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*/)
    if (match) {
      const key = match[1]
      if (topLevelKeys.includes(key)) {
        results.push({ line: idx + 1, type: "error", message: `Duplicate key "${key}" — later definition will overwrite earlier one.` })
      } else {
        topLevelKeys.push(key)
      }
    }
  })

  const hasErrors = results.some(r => r.type === "error")
  return { results, valid: !hasErrors }
}

const EXAMPLES = {
  kubernetes: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"`,
  compose: `version: "3.9"
services:
  web:
    image: node:18-alpine
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_PASSWORD: mysecret123
    depends_on:
      - db
  db:
    image: postgres:latest
    environment:
      POSTGRES_PASSWORD: mysecret123`,
}

export default function YAMLValidatorPage() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<LintResult[] | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)

  const validate = () => {
    if (!input.trim()) return
    const { results, valid } = validateYAML(input)
    setResults(results)
    setValid(valid)
  }

  const loadExample = (key: keyof typeof EXAMPLES) => {
    setInput(EXAMPLES[key])
    setResults(null)
    setValid(null)
  }

  const copyFixed = () => {
    navigator.clipboard.writeText(input.replace(/\t/g, "  "))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const errors = results?.filter(r => r.type === "error") ?? []
  const warnings = results?.filter(r => r.type === "warning") ?? []
  const infos = results?.filter(r => r.type === "info") ?? []

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* Back */}
        <Link href="/devtools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          All Tools
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-4">
            <CheckSquare className="h-3.5 w-3.5" />
            Free Tool
          </div>
          <h1 className="text-3xl font-bold mb-2">YAML Validator</h1>
          <p className="text-muted-foreground">Validate Kubernetes manifests, Docker Compose files, and CI/CD configs. Catches tabs, bad indentation, duplicate keys, security issues, and more.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Paste your YAML</label>
              <div className="flex gap-2">
                <button onClick={() => loadExample("kubernetes")} className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">K8s Example</button>
                <button onClick={() => loadExample("compose")} className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">Compose Example</button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setResults(null); setValid(null) }}
              placeholder="Paste your YAML here..."
              rows={20}
              className="w-full rounded-xl border border-border bg-card/50 p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y"
            />
            <button
              onClick={validate}
              disabled={!input.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold transition-colors"
            >
              Validate YAML
            </button>
          </div>

          {/* Results */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Results</label>
              {results && errors.length > 0 && (
                <button onClick={copyFixed} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy fixed (tabs→spaces)"}
                </button>
              )}
            </div>

            {!results && (
              <div className="rounded-xl border border-border/50 bg-card/30 h-[480px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Results will appear here after validation</p>
              </div>
            )}

            {results && (
              <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
                {/* Status bar */}
                <div className={`flex items-center gap-2 p-4 border-b border-border/50 ${valid ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                  {valid
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    : <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                  }
                  <span className={`font-semibold text-sm ${valid ? "text-emerald-400" : "text-red-400"}`}>
                    {valid ? "Valid YAML" : "Validation Failed"}
                  </span>
                  <div className="ml-auto flex gap-3 text-xs text-muted-foreground">
                    {errors.length > 0 && <span className="text-red-400">{errors.length} error{errors.length > 1 ? "s" : ""}</span>}
                    {warnings.length > 0 && <span className="text-amber-400">{warnings.length} warning{warnings.length > 1 ? "s" : ""}</span>}
                    {infos.length > 0 && <span className="text-blue-400">{infos.length} info</span>}
                  </div>
                </div>

                {results.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                    <p className="text-emerald-400 font-medium">No issues found!</p>
                    <p className="text-muted-foreground text-sm mt-1">Your YAML looks clean.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30 max-h-[420px] overflow-y-auto">
                    {results.map((r, i) => (
                      <div key={i} className="flex gap-3 p-3 hover:bg-card/50 transition-colors">
                        {r.type === "error" && <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />}
                        {r.type === "warning" && <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />}
                        {r.type === "info" && <CheckSquare className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground font-mono">Line {r.line} </span>
                          <span className="text-sm text-foreground">{r.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
