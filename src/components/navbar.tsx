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
  {
    href: "/",
    label: "Home",
    activeText: "text-blue-400",
    activeBg: "bg-blue-500/10",
    hoverText: "hover:text-blue-400",
    hoverBg: "hover:bg-blue-500/10",
    underline: "bg-blue-400",
    glow: "shadow-blue-500/30",
  },
  {
    href: "/blog",
    label: "Blog",
    activeText: "text-violet-400",
    activeBg: "bg-violet-500/10",
    hoverText: "hover:text-violet-400",
    hoverBg: "hover:bg-violet-500/10",
    underline: "bg-violet-400",
    glow: "shadow-violet-500/30",
  },
  {
    href: "/cheatsheets",
    label: "Cheatsheets",
    activeText: "text-cyan-400",
    activeBg: "bg-cyan-500/10",
    hoverText: "hover:text-cyan-400",
    hoverBg: "hover:bg-cyan-500/10",
    underline: "bg-cyan-400",
    glow: "shadow-cyan-500/30",
  },
  {
    href: "/interview-prep",
    label: "Interview Prep",
    activeText: "text-pink-400",
    activeBg: "bg-pink-500/10",
    hoverText: "hover:text-pink-400",
    hoverBg: "hover:bg-pink-500/10",
    underline: "bg-pink-400",
    glow: "shadow-pink-500/30",
  },
  {
    href: "/roadmap",
    label: "Roadmap",
    activeText: "text-emerald-400",
    activeBg: "bg-emerald-500/10",
    hoverText: "hover:text-emerald-400",
    hoverBg: "hover:bg-emerald-500/10",
    underline: "bg-emerald-400",
    glow: "shadow-emerald-500/30",
  },
  {
    href: "/about",
    label: "About",
    activeText: "text-orange-400",
    activeBg: "bg-orange-500/10",
    hoverText: "hover:text-orange-400",
    hoverBg: "hover:bg-orange-500/10",
    underline: "bg-orange-400",
    glow: "shadow-orange-500/30",
  },
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
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow shadow-violet-500/30 group-hover:shadow-violet-500/60 group-hover:scale-110 transition-all duration-200">
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
                  "relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                  "hover:-translate-y-0.5 hover:scale-105 hover:shadow-md",
                  link.hoverBg,
                  link.hoverText,
                  link.glow,
                  isActive
                    ? `${link.activeBg} ${link.activeText} font-semibold`
                    : "text-muted-foreground"
                )}
              >
                {link.label}
                {/* Active underline */}
                {isActive && (
                  <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full ${link.underline} opacity-80`} />
                )}
              </Link>
            )
          })}

          {/* Shop — special pill */}
          <Link
            href="/shop"
            className={cn(
              "relative ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border",
              "hover:-translate-y-0.5 hover:scale-105",
              pathname === "/shop"
                ? "border-violet-500/60 bg-violet-500/10 text-violet-400 shadow-sm shadow-violet-500/20"
                : "border-border hover:border-violet-500/50 hover:bg-violet-500/10 text-muted-foreground hover:text-violet-400 hover:shadow-md hover:shadow-violet-500/20"
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
                {[...navLinks, { href: "/shop", label: "Shop", activeText: "text-violet-400", activeBg: "bg-violet-500/10", hoverText: "hover:text-violet-400", hoverBg: "hover:bg-violet-500/10", underline: "bg-violet-400", glow: "shadow-violet-500/20" }].map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
                        link.hoverBg,
                        link.hoverText,
                        isActive
                          ? `${link.activeBg} ${link.activeText} font-semibold`
                          : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                      {link.href === "/shop" && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">NEW</span>
                      )}
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
