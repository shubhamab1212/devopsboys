import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, Wrench, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "DevOps Tools & Resources We Recommend",
  description: "Curated list of DevOps tools, cloud platforms, learning resources, and services used by professional engineers.",
}

interface Tool {
  name: string
  description: string
  href: string
  badge?: string
  badgeColor?: string
  affiliate?: boolean
}

interface Category {
  title: string
  description: string
  color: string
  dot: string
  tools: Tool[]
}

const categories: Category[] = [
  {
    title: "Cloud & Hosting",
    description: "Platforms to deploy and scale your infrastructure",
    color: "text-orange-400",
    dot: "bg-orange-500",
    tools: [
      {
        name: "AWS",
        description: "The industry standard. EC2, EKS, S3, Lambda — everything you need for production workloads.",
        href: "https://aws.amazon.com",
        badge: "Industry Standard",
        badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        affiliate: true,
      },
      {
        name: "DigitalOcean",
        description: "Simpler and cheaper than AWS for small-to-medium projects. Great Kubernetes managed service (DOKS).",
        href: "https://m.do.co/c/fb46f21445dc",
        badge: "$200 Free Credit",
        badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        affiliate: true,
      },
      {
        name: "Vercel",
        description: "Best-in-class platform for Next.js and frontend deployments. Zero-config, instant previews.",
        href: "https://vercel.com",
        affiliate: true,
      },
      {
        name: "Cloudflare",
        description: "CDN, DDoS protection, DNS, and edge computing. Free tier is incredibly generous.",
        href: "https://cloudflare.com",
      },
    ],
  },
  {
    title: "Containers & Orchestration",
    description: "Run and manage containerized workloads",
    color: "text-blue-400",
    dot: "bg-blue-500",
    tools: [
      {
        name: "Docker Desktop",
        description: "The standard for local container development. Run any workload consistently across machines.",
        href: "https://www.docker.com/products/docker-desktop",
      },
      {
        name: "Rancher Desktop",
        description: "Free Docker Desktop alternative. Includes nerdctl, containerd, and a local k3s cluster.",
        href: "https://rancherdesktop.io",
        badge: "Free",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      },
      {
        name: "k9s",
        description: "Terminal UI for Kubernetes. Navigate pods, logs, and resources 10x faster than kubectl.",
        href: "https://k9scli.io",
        badge: "Must Have",
        badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      },
      {
        name: "Lens (OpenLens)",
        description: "GUI Kubernetes IDE. Visualize cluster state, resource metrics, and workloads.",
        href: "https://k8slens.dev",
      },
    ],
  },
  {
    title: "CI/CD & GitOps",
    description: "Automate your build, test, and deployment pipelines",
    color: "text-cyan-400",
    dot: "bg-cyan-500",
    tools: [
      {
        name: "GitHub Actions",
        description: "Our go-to CI/CD tool. Deep GitHub integration, huge marketplace, generous free tier.",
        href: "https://github.com/features/actions",
        badge: "Recommended",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      },
      {
        name: "ArgoCD",
        description: "GitOps continuous delivery for Kubernetes. Declarative, auditable deployments from Git.",
        href: "https://argo-cd.readthedocs.io",
      },
      {
        name: "Tekton",
        description: "Cloud-native CI/CD framework built on Kubernetes. Highly flexible pipeline engine.",
        href: "https://tekton.dev",
      },
    ],
  },
  {
    title: "Infrastructure as Code",
    description: "Define and manage infrastructure declaratively",
    color: "text-purple-400",
    dot: "bg-purple-500",
    tools: [
      {
        name: "Terraform",
        description: "The standard IaC tool. Define cloud resources in HCL, version them, and deploy reliably.",
        href: "https://www.terraform.io",
        badge: "Industry Standard",
        badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        affiliate: true,
      },
      {
        name: "Pulumi",
        description: "IaC using real programming languages (TypeScript, Python, Go). Great for complex logic.",
        href: "https://www.pulumi.com",
        affiliate: true,
      },
      {
        name: "Helm",
        description: "Kubernetes package manager. Templatize and share your K8s manifests as charts.",
        href: "https://helm.sh",
      },
    ],
  },
  {
    title: "Monitoring & Observability",
    description: "Know what's happening in your systems",
    color: "text-yellow-400",
    dot: "bg-yellow-500",
    tools: [
      {
        name: "Datadog",
        description: "Full-stack monitoring — metrics, logs, traces, APM, and alerts in one platform.",
        href: "https://www.datadoghq.com",
        badge: "14-day Trial",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        affiliate: true,
      },
      {
        name: "Grafana Cloud",
        description: "Prometheus + Loki + Tempo as a managed service. Free tier is very usable.",
        href: "https://grafana.com/products/cloud",
        badge: "Free Tier",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        affiliate: true,
      },
      {
        name: "Upstash",
        description: "Serverless Redis and Kafka. We use it for our post view counter — zero ops.",
        href: "https://upstash.com",
        badge: "Free Tier",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        affiliate: true,
      },
    ],
  },
  {
    title: "Security & Secrets",
    description: "Keep your infrastructure and credentials safe",
    color: "text-red-400",
    dot: "bg-red-500",
    tools: [
      {
        name: "HashiCorp Vault",
        description: "Secrets management and data protection. Dynamic secrets, encryption, and PKI.",
        href: "https://www.vaultproject.io",
        affiliate: true,
      },
      {
        name: "Trivy",
        description: "Free open-source vulnerability scanner for containers, filesystems, and IaC configs.",
        href: "https://aquasecurity.github.io/trivy",
        badge: "Free & Open Source",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      },
      {
        name: "Snyk",
        description: "Developer-first security — scan code, containers, and dependencies for vulnerabilities.",
        href: "https://snyk.io",
        affiliate: true,
      },
    ],
  },
  {
    title: "Learning & Certifications",
    description: "Level up your DevOps skills",
    color: "text-pink-400",
    dot: "bg-pink-500",
    tools: [
      {
        name: "KodeKloud",
        description: "Hands-on labs for Kubernetes, Docker, Terraform, and DevOps. Best for practical learning.",
        href: "https://kodekloud.com",
        badge: "Highly Recommended",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        affiliate: true,
      },
      {
        name: "A Cloud Guru",
        description: "Cloud certification prep — AWS, GCP, Azure. Video courses + hands-on labs.",
        href: "https://acloudguru.com",
        affiliate: true,
      },
      {
        name: "Udemy",
        description: "Mumshad Mannambeth's Kubernetes course is the best K8s resource online. Always on sale.",
        href: "https://udemy.com",
        affiliate: true,
      },
    ],
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-600/10 to-blue-600/8 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Wrench className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Tools & Resources</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Tools We{" "}
            <span className="text-shimmer bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Actually Use
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6 leading-relaxed">
            A curated list of DevOps tools, platforms, and learning resources we genuinely recommend.
            No fluff — only tools that engineers use in production every day.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-yellow-400" />
            Some links are affiliate links — you pay the same price, and we earn a small commission that helps keep this site free.
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="container mx-auto max-w-5xl px-4 py-12 pb-20 space-y-14">
        {categories.map((cat) => (
          <section key={cat.title}>
            <div className="flex items-center gap-2.5 mb-6">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${cat.dot}`} />
              <h2 className={`text-xl font-bold ${cat.color}`}>{cat.title}</h2>
              <span className="text-sm text-muted-foreground">&mdash; {cat.description}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {cat.tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-5 hover:border-border/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {tool.name}
                      </span>
                      {tool.badge && (
                        <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      )}
                      {tool.affiliate && (
                        <span className="px-2 py-0.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-[10px] font-medium">
                          Affiliate
                        </span>
                      )}
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors mt-0.5" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
          <p className="text-sm font-medium mb-1">Using a tool we missed?</p>
          <p className="text-sm text-muted-foreground mb-3">
            Reach out at{" "}
            <a href="mailto:hello@devopsboys.com" className="text-primary hover:underline">
              hello@devopsboys.com
            </a>{" "}
            — we&apos;re always looking to add genuinely useful tools.
          </p>
          <Link href="/blog" className="text-sm text-primary hover:underline">
            Read our DevOps guides →
          </Link>
        </div>
      </div>
    </div>
  )
}
