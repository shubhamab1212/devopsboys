import type { Metadata } from "next"
import Link from "next/link"
import {
  Terminal, Server, Container, Layers, GitBranch, Cloud,
  Shield, BarChart2, Bot, Wrench, CheckCircle2, ExternalLink,
} from "lucide-react"

export const metadata: Metadata = {
  title: "DevOps Learning Roadmap",
  description: "Step-by-step DevOps learning path from zero to senior engineer — Linux, Docker, Kubernetes, AWS, CI/CD, IaC, Monitoring, and Security.",
}

interface RoadmapItem {
  phase: number
  title: string
  subtitle: string
  icon: React.ElementType
  color: string
  iconBg: string
  iconColor: string
  border: string
  gradient: string
  level: "foundation" | "intermediate" | "advanced" | "expert"
  timeEst: string
  skills: string[]
  tools: string[]
  resources: { label: string; href: string; internal?: boolean }[]
}

const roadmap: RoadmapItem[] = [
  {
    phase: 1,
    title: "Linux & Networking Foundations",
    subtitle: "The bedrock of all DevOps work",
    icon: Terminal,
    color: "gray",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
    border: "border-slate-500/20",
    gradient: "from-slate-500/10",
    level: "foundation",
    timeEst: "4–6 weeks",
    skills: [
      "File system navigation, permissions, users",
      "Process management (ps, top, kill, systemd)",
      "Networking basics (TCP/IP, DNS, HTTP, SSH)",
      "Shell scripting (bash, variables, loops, functions)",
      "Package managers (apt, yum, brew)",
      "Text processing (grep, awk, sed, jq)",
    ],
    tools: ["bash", "vim/nano", "ssh", "curl/wget", "tmux"],
    resources: [
      { label: "Linux Command Line (free book)", href: "https://linuxcommand.org" },
      { label: "Git Cheatsheet", href: "/cheatsheets/git", internal: true },
    ],
  },
  {
    phase: 2,
    title: "Git & Version Control",
    subtitle: "Collaborate on code like a pro",
    icon: GitBranch,
    color: "emerald",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/10",
    level: "foundation",
    timeEst: "1–2 weeks",
    skills: [
      "Commits, branches, merging, rebasing",
      "Pull requests and code review workflow",
      "Git hooks and conventional commits",
      "Monorepo vs multi-repo strategies",
      "Resolving merge conflicts",
    ],
    tools: ["git", "GitHub / GitLab", "pre-commit"],
    resources: [
      { label: "Git Cheatsheet", href: "/cheatsheets/git", internal: true },
      { label: "Pro Git (free book)", href: "https://git-scm.com/book" },
    ],
  },
  {
    phase: 3,
    title: "Containers with Docker",
    subtitle: "Package and run anything, anywhere",
    icon: Container,
    color: "blue",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    border: "border-blue-500/20",
    gradient: "from-blue-500/10",
    level: "intermediate",
    timeEst: "3–4 weeks",
    skills: [
      "Containers vs VMs — how Docker works",
      "Writing efficient multi-stage Dockerfiles",
      "Image layers, caching, and optimization",
      "Docker Compose for local dev environments",
      "Container networking and volumes",
      "Container security best practices",
    ],
    tools: ["docker", "docker compose", "docker hub", "distroless/alpine images"],
    resources: [
      { label: "Docker Complete Guide", href: "/blog/docker-beginners-guide", internal: true },
      { label: "Docker Cheatsheet", href: "/cheatsheets/docker", internal: true },
      { label: "Docker Interview Questions", href: "/interview-prep/docker", internal: true },
    ],
  },
  {
    phase: 4,
    title: "Kubernetes",
    subtitle: "Orchestrate containers at scale",
    icon: Layers,
    color: "violet",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    border: "border-violet-500/20",
    gradient: "from-violet-500/10",
    level: "intermediate",
    timeEst: "6–8 weeks",
    skills: [
      "Control plane and worker node architecture",
      "Pods, Deployments, StatefulSets, DaemonSets",
      "Services, Ingress, NetworkPolicies",
      "ConfigMaps, Secrets, and resource limits",
      "RBAC, ServiceAccounts, PodSecurityAdmission",
      "HPA, VPA, Cluster Autoscaler",
      "Persistent Volumes and StorageClasses",
    ],
    tools: ["kubectl", "kind / minikube (local)", "k9s", "Lens", "Helm"],
    resources: [
      { label: "Kubernetes Architecture Explained", href: "/blog/kubernetes-architecture-explained", internal: true },
      { label: "Kubernetes Cheatsheet", href: "/cheatsheets/kubernetes", internal: true },
      { label: "Kubernetes Interview Questions", href: "/interview-prep/kubernetes", internal: true },
    ],
  },
  {
    phase: 5,
    title: "CI/CD Pipelines",
    subtitle: "Automate build, test, and deploy",
    icon: GitBranch,
    color: "cyan",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    border: "border-cyan-500/20",
    gradient: "from-cyan-500/10",
    level: "intermediate",
    timeEst: "3–5 weeks",
    skills: [
      "Pipeline design — stages, jobs, artifacts",
      "GitHub Actions workflows and reusable workflows",
      "Jenkins pipelines as code (Jenkinsfile)",
      "Caching, parallelism, and matrix builds",
      "Secret management in pipelines",
      "GitOps with ArgoCD / Flux",
      "Progressive delivery: canary, blue-green",
    ],
    tools: ["GitHub Actions", "ArgoCD", "Jenkins", "Tekton", "Flux"],
    resources: [
      { label: "CI/CD Interview Questions", href: "/interview-prep/cicd", internal: true },
    ],
  },
  {
    phase: 6,
    title: "Cloud — AWS",
    subtitle: "Deploy and scale on the world's largest cloud",
    icon: Cloud,
    color: "orange",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    border: "border-orange-500/20",
    gradient: "from-orange-500/10",
    level: "intermediate",
    timeEst: "6–8 weeks",
    skills: [
      "IAM, STS, roles, policies, least-privilege",
      "VPC, subnets, security groups, NACLs",
      "EC2, Auto Scaling Groups, ALB/NLB",
      "S3, lifecycle policies, versioning",
      "EKS — cluster setup, IRSA, node groups",
      "Lambda, API Gateway, serverless patterns",
      "RDS, ElastiCache, DynamoDB basics",
    ],
    tools: ["AWS CLI", "EKS", "ECR", "CloudWatch", "CloudFormation"],
    resources: [
      { label: "AWS DevOps Tools Overview", href: "/blog/aws-devops-tools-overview", internal: true },
      { label: "AWS CLI Cheatsheet", href: "/cheatsheets/aws", internal: true },
      { label: "AWS Interview Questions", href: "/interview-prep/aws", internal: true },
    ],
  },
  {
    phase: 7,
    title: "Infrastructure as Code",
    subtitle: "Automate your entire infrastructure",
    icon: Wrench,
    color: "purple",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    border: "border-purple-500/20",
    gradient: "from-purple-500/10",
    level: "advanced",
    timeEst: "4–6 weeks",
    skills: [
      "Terraform — providers, modules, state, workspaces",
      "Terraform Cloud / S3 remote state + locking",
      "Helm charts for Kubernetes deployments",
      "Kustomize — overlays and patches",
      "Ansible for configuration management",
      "Policy as code — OPA, Sentinel",
    ],
    tools: ["Terraform", "Helm", "Kustomize", "Ansible", "Pulumi"],
    resources: [
      { label: "DevOps Interview Questions", href: "/interview-prep/devops", internal: true },
    ],
  },
  {
    phase: 8,
    title: "Monitoring & Observability",
    subtitle: "Know what's happening in production",
    icon: BarChart2,
    color: "yellow",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
    border: "border-yellow-500/20",
    gradient: "from-yellow-500/10",
    level: "advanced",
    timeEst: "3–4 weeks",
    skills: [
      "The 3 pillars: metrics, logs, traces",
      "Prometheus + Grafana for metrics",
      "Alertmanager and on-call runbooks",
      "ELK / Loki stack for log aggregation",
      "Distributed tracing with Jaeger / Tempo",
      "SLOs, SLAs, error budgets — SRE concepts",
    ],
    tools: ["Prometheus", "Grafana", "Loki", "Jaeger", "Datadog", "New Relic"],
    resources: [],
  },
  {
    phase: 9,
    title: "Security & DevSecOps",
    subtitle: "Shift security left — bake it in from day one",
    icon: Shield,
    color: "red",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    border: "border-red-500/20",
    gradient: "from-red-500/10",
    level: "advanced",
    timeEst: "3–4 weeks",
    skills: [
      "SAST / DAST — scan code and running apps",
      "Container image scanning (Trivy, Snyk)",
      "Secret scanning — prevent credential leaks",
      "Kubernetes security hardening (OPA/Gatekeeper)",
      "Network policies and service mesh (Istio, Cilium)",
      "Compliance as code — CIS benchmarks",
    ],
    tools: ["Trivy", "Snyk", "OPA / Gatekeeper", "Falco", "Vault", "cert-manager"],
    resources: [],
  },
  {
    phase: 10,
    title: "AI/MLOps & Platform Engineering",
    subtitle: "The cutting edge of modern DevOps",
    icon: Bot,
    color: "pink",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    border: "border-pink-500/20",
    gradient: "from-pink-500/10",
    level: "expert",
    timeEst: "Ongoing",
    skills: [
      "ML pipeline orchestration (Kubeflow, Airflow)",
      "Model serving and inference (Triton, KServe)",
      "GPU workloads on Kubernetes",
      "Internal Developer Platforms (Backstage)",
      "Platform engineering and golden paths",
      "Cost engineering and FinOps",
    ],
    tools: ["Kubeflow", "MLflow", "Backstage", "Crossplane", "KEDA"],
    resources: [],
  },
]

const levelConfig = {
  foundation:   { label: "Foundation",    cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  intermediate: { label: "Intermediate",  cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  advanced:     { label: "Advanced",      cls: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  expert:       { label: "Expert",        cls: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-violet-600/10 to-pink-600/8 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Server className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Roadmap</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            DevOps{" "}
            <span className="text-shimmer bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Learning Path
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Your step-by-step guide from zero to senior DevOps engineer. Each phase builds on the previous —
            follow it sequentially or jump to where you are.
          </p>

          <div className="flex flex-wrap gap-3">
            {Object.entries(levelConfig).map(([, { label, cls }]) => (
              <span key={label} className={`px-3 py-1 rounded-full border text-xs font-medium ${cls}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto max-w-4xl px-4 py-12 pb-20">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border to-transparent hidden sm:block" />

          <div className="space-y-6">
            {roadmap.map((item) => {
              const Icon = item.icon
              const lv = levelConfig[item.level]
              return (
                <div key={item.phase} className="relative sm:pl-20">
                  {/* Phase circle on timeline */}
                  <div className={`hidden sm:flex absolute left-0 top-6 w-12 h-12 rounded-full border-2 ${item.border} ${item.iconBg} items-center justify-center shrink-0 z-10 bg-background`}>
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>

                  {/* Card */}
                  <div className={`rounded-2xl border ${item.border} bg-card p-6 transition-all duration-200 hover:shadow-lg`}>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {/* Mobile icon */}
                        <div className={`sm:hidden flex h-9 w-9 items-center justify-center rounded-xl ${item.iconBg} shrink-0`}>
                          <Icon className={`h-4 w-4 ${item.iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Phase {item.phase}</span>
                          </div>
                          <h2 className="text-lg font-bold leading-snug">{item.title}</h2>
                          <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${lv.cls}`}>{lv.label}</span>
                        <span className="px-2.5 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground">{item.timeEst}</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Skills */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">What to learn</p>
                        <ul className="space-y-1.5">
                          {item.skills.map((skill) => (
                            <li key={skill} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${item.iconColor}`} />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tools + Resources */}
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Key tools</p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.tools.map((tool) => (
                              <span key={tool} className="px-2.5 py-1 rounded-full bg-muted border border-border text-xs font-medium">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        {item.resources.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Resources</p>
                            <div className="flex flex-col gap-1.5">
                              {item.resources.map((r) => (
                                <Link
                                  key={r.href}
                                  href={r.href}
                                  target={r.internal ? undefined : "_blank"}
                                  rel={r.internal ? undefined : "noopener noreferrer"}
                                  className={`inline-flex items-center gap-1.5 text-sm font-medium ${item.iconColor} hover:underline`}
                                >
                                  {r.internal
                                    ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                    : <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                  }
                                  {r.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
