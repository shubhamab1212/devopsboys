"use client"

import { useState } from "react"
import { Calculator, ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"

interface CalcInputs {
  replicas: number
  cpuPerPod: number       // millicores
  memPerPod: number       // MiB
  burstFactor: number     // limit multiplier
  containerName: string
  appName: string
}

interface CalcResult {
  cpuRequest: string
  cpuLimit: string
  memRequest: string
  memLimit: string
  totalCpu: string
  totalMem: string
  yaml: string
}

function calculate(inputs: CalcInputs): CalcResult {
  const cpuRequest = inputs.cpuPerPod
  const cpuLimit = Math.round(cpuRequest * inputs.burstFactor)
  const memRequest = inputs.memPerPod
  const memLimit = Math.round(memRequest * inputs.burstFactor)

  const totalCpu = cpuRequest * inputs.replicas
  const totalMem = memRequest * inputs.replicas

  const cpuReqStr = cpuRequest >= 1000 ? `${cpuRequest / 1000}` : `${cpuRequest}m`
  const cpuLimStr = cpuLimit >= 1000 ? `${cpuLimit / 1000}` : `${cpuLimit}m`
  const memReqStr = memRequest >= 1024 ? `${(memRequest / 1024).toFixed(1)}Gi` : `${memRequest}Mi`
  const memLimStr = memLimit >= 1024 ? `${(memLimit / 1024).toFixed(1)}Gi` : `${memLimit}Mi`
  const totCpuStr = totalCpu >= 1000 ? `${(totalCpu / 1000).toFixed(1)} cores` : `${totalCpu}m`
  const totMemStr = totalMem >= 1024 ? `${(totalMem / 1024).toFixed(1)} GiB` : `${totalMem} MiB`

  const yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${inputs.appName}
spec:
  replicas: ${inputs.replicas}
  selector:
    matchLabels:
      app: ${inputs.appName}
  template:
    metadata:
      labels:
        app: ${inputs.appName}
    spec:
      containers:
      - name: ${inputs.containerName}
        image: your-image:tag
        resources:
          requests:
            cpu: "${cpuReqStr}"
            memory: "${memReqStr}"
          limits:
            cpu: "${cpuLimStr}"
            memory: "${memLimStr}"`

  return {
    cpuRequest: cpuReqStr,
    cpuLimit: cpuLimStr,
    memRequest: memReqStr,
    memLimit: memLimStr,
    totalCpu: totCpuStr,
    totalMem: totMemStr,
    yaml,
  }
}

const PRESETS = [
  { label: "Node.js API", cpuPerPod: 250, memPerPod: 256, replicas: 3 },
  { label: "Go microservice", cpuPerPod: 100, memPerPod: 128, replicas: 5 },
  { label: "Python worker", cpuPerPod: 500, memPerPod: 512, replicas: 2 },
  { label: "Java Spring Boot", cpuPerPod: 1000, memPerPod: 1024, replicas: 3 },
  { label: "Nginx (proxy)", cpuPerPod: 100, memPerPod: 64, replicas: 2 },
]

export default function K8sCalculatorPage() {
  const [inputs, setInputs] = useState<CalcInputs>({
    replicas: 3,
    cpuPerPod: 250,
    memPerPod: 256,
    burstFactor: 2,
    containerName: "app",
    appName: "my-app",
  })
  const [copied, setCopied] = useState(false)

  const result = calculate(inputs)

  const set = (key: keyof CalcInputs, value: string | number) =>
    setInputs(prev => ({ ...prev, [key]: value }))

  const copyYaml = () => {
    navigator.clipboard.writeText(result.yaml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <Link href="/devtools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          All Tools
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-4">
            <Calculator className="h-3.5 w-3.5" />
            Free Tool
          </div>
          <h1 className="text-3xl font-bold mb-2">Kubernetes Resource Calculator</h1>
          <p className="text-muted-foreground">Set your app requirements and get recommended CPU/memory requests and limits — with copy-ready YAML.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left — Inputs */}
          <div className="space-y-5">
            {/* Presets */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Presets</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => setInputs(prev => ({ ...prev, cpuPerPod: p.cpuPerPod, memPerPod: p.memPerPod, replicas: p.replicas }))}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-violet-500/20 hover:text-violet-300 hover:border-violet-500/40 border border-transparent transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main inputs */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5 space-y-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Configuration</p>

              {/* App name */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">App Name</label>
                <input
                  value={inputs.appName}
                  onChange={e => set("appName", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              {/* Replicas */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">Replicas</label>
                  <span className="text-sm font-mono text-violet-400">{inputs.replicas}</span>
                </div>
                <input type="range" min={1} max={20} value={inputs.replicas} onChange={e => set("replicas", parseInt(e.target.value))}
                  className="w-full accent-violet-500" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1</span><span>20</span></div>
              </div>

              {/* CPU per pod */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">CPU per pod</label>
                  <span className="text-sm font-mono text-violet-400">
                    {inputs.cpuPerPod >= 1000 ? `${inputs.cpuPerPod / 1000} cores` : `${inputs.cpuPerPod}m`}
                  </span>
                </div>
                <input type="range" min={50} max={4000} step={50} value={inputs.cpuPerPod} onChange={e => set("cpuPerPod", parseInt(e.target.value))}
                  className="w-full accent-violet-500" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>50m</span><span>4 cores</span></div>
              </div>

              {/* Memory per pod */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">Memory per pod</label>
                  <span className="text-sm font-mono text-violet-400">
                    {inputs.memPerPod >= 1024 ? `${(inputs.memPerPod / 1024).toFixed(1)} GiB` : `${inputs.memPerPod} MiB`}
                  </span>
                </div>
                <input type="range" min={64} max={8192} step={64} value={inputs.memPerPod} onChange={e => set("memPerPod", parseInt(e.target.value))}
                  className="w-full accent-violet-500" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>64 MiB</span><span>8 GiB</span></div>
              </div>

              {/* Burst factor */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">Burst Factor (limit / request)</label>
                  <span className="text-sm font-mono text-violet-400">{inputs.burstFactor}x</span>
                </div>
                <input type="range" min={1} max={4} step={0.5} value={inputs.burstFactor} onChange={e => set("burstFactor", parseFloat(e.target.value))}
                  className="w-full accent-violet-500" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1x (Guaranteed QoS)</span>
                  <span>4x (Burstable)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Results */}
          <div className="space-y-4">
            {/* Per-pod summary */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Per Pod</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "CPU Request", value: result.cpuRequest, color: "text-violet-400" },
                  { label: "CPU Limit", value: result.cpuLimit, color: "text-orange-400" },
                  { label: "Memory Request", value: result.memRequest, color: "text-blue-400" },
                  { label: "Memory Limit", value: result.memLimit, color: "text-pink-400" },
                ].map(item => (
                  <div key={item.label} className="rounded-xl bg-card/50 border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className={`font-mono text-lg font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total cluster */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Total Cluster Resources ({inputs.replicas} replicas)</p>
              <div className="flex gap-4">
                <div className="flex-1 rounded-xl bg-slate-800/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">CPU (requests)</p>
                  <p className="font-mono text-base font-bold text-violet-400">{result.totalCpu}</p>
                </div>
                <div className="flex-1 rounded-xl bg-slate-800/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Memory (requests)</p>
                  <p className="font-mono text-base font-bold text-blue-400">{result.totalMem}</p>
                </div>
              </div>
            </div>

            {/* YAML output */}
            <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ready-to-use YAML</p>
                <button onClick={copyYaml} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">{result.yaml}</pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
