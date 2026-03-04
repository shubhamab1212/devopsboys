"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Menu, Terminal, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { SearchDialog } from "./search"
import { posts } from "@/lib/content"

const navLinks = [
  { href: "/",              label: "Home",          color: "from-blue-400 to-blue-500" },
  { href: "/blog",          label: "Blog",          color: "from-violet-400 to-purple-500" },
  { href: "/cheatsheets",   label: "Cheatsheets",   color: "from-cyan-400 to-blue-400" },
  { href: "/interview-prep",label: "Interview Prep",color: "from-purple-400 to-pink-400" },
  { href: "/roadmap",       label: "Roadmap",       color: "from-emerald-400 to-teal-400" },
  { href: "/about",         label: "About",         color: "from-orange-400 to-amber-400" },
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
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Gradient bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

      <div className="container mx-auto max-w-6xl px-4 flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl shrink-0 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow shadow-violet-500/30 group-hover:shadow-violet-500/60 group-hover:scale-105 transition-all duration-200">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="hidden sm:block">
            <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">DevOps</span>
            <span className="text-foreground">Boys</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 group/link",
                  isActive
                    ? "text-foreground bg-accent/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                )}
              >
                {/* Gradient text on active */}
                <span className={cn(
                  "relative z-10 transition-all duration-200",
                  isActive
                    ? `bg-gradient-to-r ${link.color} bg-clip-text text-transparent font-semibold`
                    : `group-hover/link:bg-gradient-to-r group-hover/link:${link.color} group-hover/link:bg-clip-text group-hover/link:text-transparent`
                )}>
                  {link.label}
                </span>

                {/* Active underline glow */}
                {isActive && (
                  <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r ${link.color} opacity-80`} />
                )}
              </Link>
            )
          })}

          {/* Shop — special pill */}
          <Link
            href="/shop"
            className={cn(
              "relative ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border",
              pathname === "/shop"
                ? "border-violet-500/60 bg-violet-500/10 text-violet-400 shadow-sm shadow-violet-500/20"
                : "border-border hover:border-violet-500/40 hover:bg-violet-500/5 text-muted-foreground hover:text-violet-400"
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Shop
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold leading-none">
              NEW
            </span>
          </Link>
        </nav>

        {/* Right side */}
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
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow shadow-violet-500/30">
                  <Terminal className="h-3.5 w-3.5" />
                </div>
                <span>
                  <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">DevOps</span>Boys
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {[...navLinks, { href: "/shop", label: "Shop", color: "from-violet-400 to-blue-400" }].map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <span className={isActive ? `bg-gradient-to-r ${link.color} bg-clip-text text-transparent font-semibold` : ""}>
                        {link.label}
                        {link.href === "/shop" && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">NEW</span>
                        )}
                      </span>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
