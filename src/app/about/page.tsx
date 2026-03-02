import { Button } from "@/components/ui/button"
import { Terminal, Github, Twitter, Linkedin, Mail, Code2, Cloud, GitBranch } from "lucide-react"
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
            {[
              { href: "https://github.com", icon: Github, label: "GitHub" },
              { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
              { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
              { href: "mailto:hello@devopsboys.com", icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent transition-all"
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{label}</span>
              </Link>
            ))}
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
