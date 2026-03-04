import type { Metadata } from "next"
import { ShoppingBag, FileText, Terminal, GitBranch, Star, Shield, Download, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Shop — DevOps Resources & Digital Products",
  description: "Premium DevOps resources: Interview prep bundles, cheat sheet packs, and GitHub Actions templates. Instant download.",
}

const products = [
  {
    id: "interview-prep",
    title: "DevOps Interview Prep Bundle",
    subtitle: "500+ Q&A — Docker, Kubernetes, AWS, CI/CD",
    description:
      "The complete interview preparation guide for DevOps engineers. Covers every topic interviewers actually ask — with detailed answers, not just buzzwords.",
    price: "$12",
    originalPrice: "$19",
    gumroadUrl: "https://devopsboys.gumroad.com/l/interview-prep-bundle",
    icon: FileText,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    badge: "Best Seller",
    badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    gradient: "from-violet-500/10 via-transparent to-transparent",
    border: "border-violet-500/20 hover:border-violet-500/50",
    accentColor: "text-violet-400",
    includes: [
      "500+ curated Q&A with detailed answers",
      "Docker — architecture, networking, security",
      "Kubernetes — pods, deployments, RBAC, troubleshooting",
      "AWS — EC2, EKS, S3, IAM, Lambda",
      "CI/CD — GitHub Actions, Jenkins, ArgoCD",
      "System design questions for senior roles",
    ],
    format: "PDF — instant download",
    pages: "120+ pages",
  },
  {
    id: "cheatsheets",
    title: "DevOps Cheat Sheets Pack",
    subtitle: "Docker · Kubernetes · AWS · Git — all in one",
    description:
      "4 beautifully formatted cheat sheets with every command you actually need. Print them, pin them, use them every day. Production-ready, no fluff.",
    price: "$9",
    originalPrice: "$15",
    gumroadUrl: "https://devopsboys.gumroad.com/l/cheatsheets-pack",
    icon: Terminal,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    badge: "Most Popular",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    gradient: "from-cyan-500/10 via-transparent to-transparent",
    border: "border-cyan-500/20 hover:border-cyan-500/50",
    accentColor: "text-cyan-400",
    includes: [
      "Docker — 55+ commands with examples",
      "Kubernetes — 65+ kubectl commands",
      "AWS CLI — EC2, S3, EKS, IAM commands",
      "Git — daily workflow to advanced tricks",
      "Copy-paste ready for terminal use",
      "Printable A4 format",
    ],
    format: "4 PDFs — instant download",
    pages: "4 cheat sheets",
  },
  {
    id: "github-actions",
    title: "GitHub Actions Templates Pack",
    subtitle: "10 ready-to-use CI/CD workflow files",
    description:
      "Stop writing pipelines from scratch. 10 production-tested GitHub Actions workflows — copy, paste, and ship. Covers Docker builds, Kubernetes deploys, and more.",
    price: "$7",
    originalPrice: "$12",
    gumroadUrl: "https://devopsboys.gumroad.com/l/github-actions-templates",
    icon: GitBranch,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badge: "New",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    gradient: "from-emerald-500/10 via-transparent to-transparent",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    accentColor: "text-emerald-400",
    includes: [
      "Docker build + push to GHCR",
      "Kubernetes rolling deployment",
      "Node.js / Python / Go CI pipelines",
      "PR checks with lint + test",
      "Scheduled jobs & cron workflows",
      "Multi-environment deploy (dev/staging/prod)",
    ],
    format: "10 YAML files + README — instant download",
    pages: "10 templates",
  },
]

const trustBadges = [
  { icon: Download, label: "Instant Download" },
  { icon: Shield, label: "Secure Payment" },
  { icon: Zap, label: "Lifetime Access" },
  { icon: Star, label: "30-day Refund" },
]

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-violet-600/10 to-blue-600/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-600/8 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Shop</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Premium{" "}
            <span className="text-shimmer bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              DevOps Resources
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Practical, no-fluff resources for DevOps engineers. Interview prep, cheat sheets, and
            ready-to-use templates — everything you need to level up fast.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto max-w-5xl px-4 py-12 pb-20">
        <div className="grid gap-6 lg:grid-cols-1">
          {products.map((product) => {
            const Icon = product.icon
            return (
              <div
                key={product.id}
                className={`group relative rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${product.border}`}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div className="relative p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${product.iconBg}`}
                        >
                          <Icon className={`h-5 w-5 ${product.iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h2 className="text-xl font-bold">{product.title}</h2>
                            <span
                              className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${product.badgeColor}`}
                            >
                              {product.badge}
                            </span>
                          </div>
                          <p className={`text-sm font-medium ${product.accentColor}`}>
                            {product.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                        {product.description}
                      </p>

                      {/* What's included */}
                      <div className="space-y-2 mb-5">
                        {product.includes.map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <span className={`mt-0.5 text-xs ${product.accentColor}`}>✓</span>
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {product.format}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {product.pages}
                        </span>
                      </div>
                    </div>

                    {/* Right: Price + CTA */}
                    <div className="flex flex-col items-center md:items-end gap-3 md:min-w-[160px]">
                      <div className="text-center md:text-right">
                        <div className="flex items-baseline gap-2 justify-center md:justify-end">
                          <span className="text-3xl font-extrabold">{product.price}</span>
                          <span className="text-base text-muted-foreground line-through">
                            {product.originalPrice}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">One-time purchase</p>
                      </div>

                      <a
                        href={product.gumroadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20 text-center`}
                      >
                        Buy Now →
                      </a>

                      <p className="text-[11px] text-muted-foreground text-center">
                        Secure checkout via Gumroad
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
          <p className="text-sm font-medium mb-1">Questions about a product?</p>
          <p className="text-sm text-muted-foreground">
            Email us at{" "}
            <a href="mailto:hello@devopsboys.com" className="text-primary hover:underline">
              hello@devopsboys.com
            </a>{" "}
            — we reply within 24 hours.
          </p>
        </div>
      </section>
    </div>
  )
}
