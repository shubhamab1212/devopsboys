"use client"

import { useState } from "react"
import { FileCode, ArrowLeft, AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react"
import Link from "next/link"

interface LintIssue {
  line: number
  severity: "error" | "warning" | "info"
  code: string
  message: string
  fix: string
}

function lintDockerfile(content: string): LintIssue[] {
  const issues: LintIssue[] = []
  const lines = content.split("\n")

  let hasUser = false
  let hasHealthcheck = false
  let hasCopy = false
  let lastRunLine = -1
  let consecutiveRunCount = 0
  let packageInstallLine = -1
  let copyAllLine = -1

  lines.forEach((raw, idx) => {
    const line = raw.trim()
    const lineNum = idx + 1

    if (!line || line.startsWith("#")) return

    const instruction = line.split(/\s+/)[0].toUpperCase()

    // FROM checks
    if (instruction === "FROM") {
      if (/:latest\s*$/.test(line) || /\s+AS\s+/i.test(line) === false && !line.includes(":")) {
        issues.push({
          line: lineNum, severity: "warning", code: "DL3007",
          message: 'Using ":latest" tag or no tag — image can change without notice.',
          fix: 'Pin to a specific version: FROM node:20.11-alpine instead of FROM node:latest',
        })
      }
      if (/^FROM\s+ubuntu\b/i.test(line) || /^FROM\s+debian\b/i.test(line)) {
        issues.push({
          line: lineNum, severity: "info", code: "DL3006",
          message: "Using a large base image. Consider a slim or alpine variant.",
          fix: "Use FROM ubuntu:22.04-slim or switch to FROM debian:bookworm-slim to reduce image size.",
        })
      }
    }

    // USER instruction tracking
    if (instruction === "USER") {
      hasUser = true
      if (/^USER\s+root\s*$/i.test(line)) {
        issues.push({
          line: lineNum, severity: "error", code: "DL3002",
          message: "Switching to root user — container will run with root privileges.",
          fix: "Create a non-root user: RUN addgroup -S app && adduser -S app -G app, then USER app",
        })
      }
    }

    // HEALTHCHECK tracking
    if (instruction === "HEALTHCHECK") hasHealthcheck = true

    // ADD vs COPY
    if (instruction === "ADD" && !line.match(/^ADD\s+https?:\/\//i)) {
      issues.push({
        line: lineNum, severity: "warning", code: "DL3020",
        message: "Using ADD instead of COPY for local files.",
        fix: "Use COPY for local files. ADD has implicit tar extraction and URL fetching — use COPY unless you specifically need that.",
      })
    }

    // RUN apt-get without -y
    if (/RUN\s+apt-get\s+install/.test(line) && !/-y\b/.test(line)) {
      issues.push({
        line: lineNum, severity: "error", code: "DL3015",
        message: "apt-get install without -y flag — build will hang waiting for confirmation.",
        fix: "Use: apt-get install -y package-name",
      })
    }

    // RUN apt-get upgrade (discouraged)
    if (/RUN.*apt-get\s+upgrade/.test(line)) {
      issues.push({
        line: lineNum, severity: "warning", code: "DL3005",
        message: "apt-get upgrade in Dockerfile is discouraged.",
        fix: "Use specific package versions or upgrade the base image instead of running apt-get upgrade.",
      })
    }

    // Secrets in ENV
    if (instruction === "ENV") {
      const secretPatterns = /(?:password|secret|key|token|credential|api_key|auth)/i
      if (secretPatterns.test(line)) {
        issues.push({
          line: lineNum, severity: "error", code: "DL3025",
          message: "Possible secret in ENV instruction — secrets baked into images are visible in image history.",
          fix: "Pass secrets at runtime via environment variables or use Docker secrets / Kubernetes secrets.",
        })
      }
    }

    // Curl | bash pattern (security risk)
    if (/curl\s+.*\|\s*(ba)?sh/.test(line) || /wget\s+.*\|\s*(ba)?sh/.test(line)) {
      issues.push({
        line: lineNum, severity: "error", code: "DL3022",
        message: "Downloading and piping to shell — supply chain attack risk.",
        fix: "Download the script, verify its checksum, then execute. Never pipe untrusted content directly to sh.",
      })
    }

    // COPY . . detection
    if (/^COPY\s+\.\s+/.test(line) || /^COPY\s+\.\s+\.$/.test(line)) {
      hasCopy = true
      copyAllLine = lineNum
    }

    // Package install detection (npm/pip/yarn)
    if (/npm\s+install|pip\s+install|yarn\s+install/.test(line) && packageInstallLine === -1) {
      packageInstallLine = lineNum
    }

    // Consecutive RUN instructions
    if (instruction === "RUN") {
      if (lastRunLine === lineNum - 1 || lastRunLine === lineNum - 2) {
        consecutiveRunCount++
        if (consecutiveRunCount === 1) {
          issues.push({
            line: lineNum, severity: "warning", code: "DL3059",
            message: "Multiple consecutive RUN instructions — each creates a new layer, increasing image size.",
            fix: "Chain them with &&: RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*",
          })
        }
      } else {
        consecutiveRunCount = 0
      }
      lastRunLine = lineNum
    }

    // apt-get update without install in same layer
    if (/apt-get\s+update/.test(line) && !/apt-get\s+install/.test(line)) {
      issues.push({
        line: lineNum, severity: "warning", code: "DL3009",
        message: "apt-get update in a separate RUN layer — can cause stale package cache.",
        fix: "Combine update and install: RUN apt-get update && apt-get install -y package && rm -rf /var/lib/apt/lists/*",
      })
    }
  })

  // COPY . . before package install
  if (copyAllLine > 0 && packageInstallLine > 0 && copyAllLine < packageInstallLine) {
    issues.push({
      line: copyAllLine, severity: "warning", code: "DL3042",
      message: "COPY . . appears before package install — any code change will bust the dependency cache.",
      fix: "Copy only package.json/requirements.txt first, install deps, then COPY . . to preserve the dependency layer cache.",
    })
  }

  // No USER instruction
  if (!hasUser) {
    issues.push({
      line: 0, severity: "error", code: "DL3002",
      message: "No USER instruction found — container will run as root.",
      fix: "Add: RUN addgroup -S app && adduser -S app -G app\nUSER app",
    })
  }

  // No HEALTHCHECK
  if (!hasHealthcheck) {
    issues.push({
      line: 0, severity: "info", code: "DL3026",
      message: "No HEALTHCHECK instruction — Kubernetes/Docker can't detect if your app is healthy.",
      fix: 'Add: HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/health || exit 1',
    })
  }

  return issues.sort((a, b) => {
    const order = { error: 0, warning: 1, info: 2 }
    return order[a.severity] - order[b.severity] || a.line - b.line
  })
}

const EXAMPLE = `FROM node:latest

ENV DB_PASSWORD=supersecret123

RUN apt-get update
RUN apt-get install curl

ADD . /app
WORKDIR /app
RUN npm install

CMD ["node", "server.js"]`

export default function DockerfileLinterPage() {
  const [input, setInput] = useState("")
  const [issues, setIssues] = useState<LintIssue[] | null>(null)

  const lint = () => {
    if (!input.trim()) return
    setIssues(lintDockerfile(input))
  }

  const errors = issues?.filter(i => i.severity === "error") ?? []
  const warnings = issues?.filter(i => i.severity === "warning") ?? []
  const infos = issues?.filter(i => i.severity === "info") ?? []
  const score = issues ? Math.max(0, 100 - errors.length * 25 - warnings.length * 10 - infos.length * 3) : null

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <Link href="/devtools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          All Tools
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-medium mb-4">
            <FileCode className="h-3.5 w-3.5" />
            Free Tool
          </div>
          <h1 className="text-3xl font-bold mb-2">Dockerfile Linter</h1>
          <p className="text-muted-foreground">Paste your Dockerfile and get a security + best practices audit. Checks for root user, unpinned tags, secret exposure, layer cache issues, and more.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Paste your Dockerfile</label>
              <button onClick={() => { setInput(EXAMPLE); setIssues(null) }}
                className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
                Load Example
              </button>
            </div>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setIssues(null) }}
              placeholder={`FROM node:20-alpine\n\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\nCOPY . .\n\nRUN addgroup -S app && adduser -S app -G app\nUSER app\n\nEXPOSE 3000\nCMD ["node", "server.js"]`}
              rows={20}
              className="w-full rounded-xl border border-border bg-card/50 p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-y"
            />
            <button
              onClick={lint}
              disabled={!input.trim()}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold transition-colors"
            >
              Lint Dockerfile
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {!issues && (
              <div className="rounded-xl border border-border/50 bg-card/30 h-[480px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Results will appear here after linting</p>
              </div>
            )}

            {issues && (
              <>
                {/* Score */}
                <div className={`rounded-2xl border p-5 ${score! >= 80 ? "border-emerald-500/20 bg-emerald-500/5" : score! >= 50 ? "border-amber-500/20 bg-amber-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Security Score</p>
                      <p className={`text-4xl font-bold font-mono ${score! >= 80 ? "text-emerald-400" : score! >= 50 ? "text-amber-400" : "text-red-400"}`}>{score}/100</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-red-400">{errors.length} error{errors.length !== 1 ? "s" : ""}</p>
                      <p className="text-xs text-amber-400">{warnings.length} warning{warnings.length !== 1 ? "s" : ""}</p>
                      <p className="text-xs text-blue-400">{infos.length} suggestion{infos.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </div>

                {/* Issues list */}
                {issues.length === 0 ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                    <p className="text-emerald-400 font-semibold">Perfect score!</p>
                    <p className="text-muted-foreground text-sm mt-1">No issues found in your Dockerfile.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {issues.map((issue, i) => (
                      <div key={i} className={`rounded-xl border p-4 ${issue.severity === "error" ? "border-red-500/20 bg-red-500/5" : issue.severity === "warning" ? "border-amber-500/20 bg-amber-500/5" : "border-blue-500/20 bg-blue-500/5"}`}>
                        <div className="flex items-start gap-2 mb-2">
                          {issue.severity === "error" && <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />}
                          {issue.severity === "warning" && <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />}
                          {issue.severity === "info" && <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded">{issue.code}</span>
                              {issue.line > 0 && <span className="text-xs text-muted-foreground">Line {issue.line}</span>}
                            </div>
                            <p className="text-sm text-foreground font-medium">{issue.message}</p>
                          </div>
                        </div>
                        <div className="ml-6 rounded-lg bg-card/60 border border-border/30 px-3 py-2">
                          <p className="text-[11px] text-muted-foreground font-semibold uppercase mb-1">Fix</p>
                          <p className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">{issue.fix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
