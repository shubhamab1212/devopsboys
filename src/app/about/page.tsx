import { Button } from "@/components/ui/button"
import { Terminal, Mail, Code2, Cloud, GitBranch } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about DevOpsBoys — a blog dedicated to practical DevOps, Cloud, and AI/ML engineering.",
}

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-b from-blue-600/10 to-transparent blur-[80px] pointer-events-none" />

      <div className="relative container mx-auto max-w-3xl px-4 py-16">

        {/* Avatar + Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <Terminal className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold mb-2">DevOpsBoys</h1>
          <p className="text-xl text-muted-foreground mb-5">DevOps Engineer &amp; Cloud Architect</p>

          <div className="flex items-center gap-3">
            <Link href="https://twitter.com/devopsboys" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent transition-all">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @devopsboys
            </Link>
            <Link href="https://instagram.com/devopsboys" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent transition-all">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              devopsboys
            </Link>
            <Link href="mailto:hello@devopsboys.com"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent transition-all">
              <Mail className="h-4 w-4" />
              hello@devopsboys.com
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-5">
          <div className="glow-card gradient-top p-6">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Who Am I?</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              I&apos;m a passionate DevOps Engineer with years of experience building and automating
              cloud infrastructure. I started DevOpsBoys to share real-world, hands-on knowledge
              with the engineering community — no fluff, just practical guides that actually work.
            </p>
          </div>

          <div className="glow-card gradient-top p-6">
            <div className="flex items-center gap-2 mb-3">
              <Cloud className="h-5 w-5 text-sky-400" />
              <h2 className="text-lg font-bold">What You&apos;ll Learn</h2>
            </div>
            <ul className="space-y-2.5 text-muted-foreground">
              {[
                "Docker containers, images, and container orchestration",
                "Kubernetes architecture, deployments, and production best practices",
                "AWS cloud services — EC2, ECS, EKS, Lambda, S3, RDS, and more",
                "CI/CD pipelines with GitHub Actions, Jenkins, and ArgoCD",
                "Infrastructure as Code using Terraform and Ansible",
                "AI/ML model deployment and MLOps workflows",
                "Monitoring, logging, and observability (Prometheus, Grafana, ELK)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-primary mt-0.5 font-bold shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glow-card gradient-top p-6">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-bold">Tech Stack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Docker", "Kubernetes", "AWS", "Terraform", "Ansible",
                "GitHub Actions", "Jenkins", "Python", "Go", "Linux",
                "Prometheus", "Grafana", "ELK Stack", "ArgoCD", "Helm",
                "Redis", "PostgreSQL", "Nginx", "Vault", "Cilium",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-sm bg-muted border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-10 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/blog">Read Articles</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="mailto:hello@devopsboys.com">Get In Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
