import Link from "next/link"
import { Terminal, Rss } from "lucide-react"
import { Separator } from "./ui/separator"

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 mt-20">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                <Terminal className="h-3.5 w-3.5" />
              </div>
              <span>
                <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">DevOps</span>Boys
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Practical guides on DevOps, Cloud, Docker, Kubernetes, AWS, and AI/ML. Real engineering knowledge, clearly explained.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <Link href="https://twitter.com/devopsboys" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent transition-all">
                <XIcon className="h-3.5 w-3.5" />
              </Link>
              <Link href="https://instagram.com/devopsboys" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent transition-all">
                <InstagramIcon className="h-3.5 w-3.5" />
              </Link>
              <Link href="/rss.xml"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent transition-all">
                <Rss className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/blog", label: "All Articles" },
                { href: "/tags", label: "Topics" },
                { href: "/about", label: "About" },
                { href: "/rss.xml", label: "RSS Feed" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Topics */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Topics</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: "DevOps",     href: "/tags/devops" },
                { label: "Docker",     href: "/tags/docker" },
                { label: "Kubernetes", href: "/tags/kubernetes" },
                { label: "AWS",        href: "/tags/aws" },
                { label: "CI/CD",      href: "/tags/cicd" },
                { label: "AI & ML",    href: "/tags/ai" },
              ].map(({ label, href }) => (
                <Link key={href} href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                  {label}
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
          <p className="text-xs text-muted-foreground">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
