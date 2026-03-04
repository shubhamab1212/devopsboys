"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Menu, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { SearchDialog } from "./search"
import { posts } from "@/lib/content"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/cheatsheets", label: "Cheatsheets" },
  { href: "/interview-prep", label: "Interview Prep" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
]

const searchPosts = posts
  .filter((p) => p.published)
  .map((p) => ({
    title: p.title,
    description: p.description,
    tags: p.tags,
    date: p.date,
    slugAsParams: p.slugAsParams,
  }))

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4 flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="hidden sm:block">
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">DevOps</span>
            <span>Boys</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-foreground hover:bg-accent",
                pathname === link.href
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: search + theme + mobile */}
        <div className="flex items-center gap-2">
          <SearchDialog posts={searchPosts} />
          <ThemeToggle />

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="w-9 h-9">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex items-center gap-2 font-bold text-lg mb-8 mt-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                  <Terminal className="h-3.5 w-3.5" />
                </div>
                <span>
                  <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">DevOps</span>Boys
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === link.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
