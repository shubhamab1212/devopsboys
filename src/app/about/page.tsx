import { Button } from "@/components/ui/button"
import { Terminal, Github, Twitter, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "DevOpsBoys ke baare mein jaano.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-500 flex items-center justify-center mb-6 shadow-xl">
          <Terminal className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2">DevOpsBoys</h1>
        <p className="text-xl text-muted-foreground">
          DevOps Engineer &amp; Cloud Enthusiast
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="mailto:hello@devopsboys.com"
            className="text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* About content */}
      <div className="prose max-w-none space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold mb-3 mt-0">Kaun hoon main?</h2>
          <p className="text-muted-foreground leading-relaxed mb-0">
            Main ek passionate DevOps Engineer hoon jo real-world experience share karna chahta hoon.
            Is blog pe main Docker, Kubernetes, AWS, CI/CD, AI/ML aur cloud technologies ke baare mein
            practical guides aur tutorials likhta hoon — simple Hindi-English language mein.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold mb-3 mt-0">Is blog ke baare mein</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            DevOpsBoys ek platform hai jahan main practical, hands-on knowledge share karta hoon.
            Yahan tum sikhoge:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-0">
            {[
              "Docker containers aur containerization",
              "Kubernetes orchestration",
              "AWS cloud services",
              "CI/CD pipelines (GitHub Actions, Jenkins)",
              "Infrastructure as Code (Terraform, Ansible)",
              "AI/ML deployment aur MLOps",
              "Monitoring, Logging aur Observability",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold mb-3 mt-0">Skills &amp; Tech Stack</h2>
          <div className="flex flex-wrap gap-2 mb-0">
            {[
              "Docker", "Kubernetes", "AWS", "Terraform", "Ansible",
              "GitHub Actions", "Jenkins", "Python", "Go", "Linux",
              "Prometheus", "Grafana", "ELK Stack", "ArgoCD", "Helm",
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-sm bg-muted border border-border text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-10 justify-center">
        <Button asChild>
          <Link href="/blog">Read Blog Posts</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="mailto:hello@devopsboys.com">Contact Me</Link>
        </Button>
      </div>
    </div>
  )
}
