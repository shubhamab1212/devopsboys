import Link from "next/link"
import { Terminal, Github, Twitter, Linkedin, Rss } from "lucide-react"
import { Separator } from "./ui/separator"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 mt-20">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
                <Terminal className="h-3.5 w-3.5" />
              </div>
              <span>
                <span className="text-primary">DevOps</span>Boys
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Practical guides on DevOps, Cloud, Docker, Kubernetes, AWS, and AI/ML. Real engineering knowledge, clearly explained.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/blog", label: "All Posts" },
                { href: "/tags", label: "Tags" },
                { href: "/about", label: "About" },
                { href: "/rss.xml", label: "RSS Feed" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Topics */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Topics</h3>
            <nav className="flex flex-col gap-2">
              {["DevOps", "Docker", "Kubernetes", "AWS", "CI/CD", "AI & ML"].map((topic) => (
                <Link
                  key={topic}
                  href={`/tags/${topic.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {topic}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevOpsBoys. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="/rss.xml"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Rss className="h-4 w-4" />
              <span className="sr-only">RSS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
