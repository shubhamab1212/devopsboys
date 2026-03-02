"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Fuse from "fuse.js"
import { Search, X, ArrowRight, Clock, Tag } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface SearchPost {
  title: string
  description: string
  tags: string[]
  date: string
  slugAsParams: string
}

interface SearchProps {
  posts: SearchPost[]
}

export function SearchDialog({ posts }: SearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchPost[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  const fuse = new Fuse(posts, {
    keys: [
      { name: "title", weight: 3 },
      { name: "description", weight: 2 },
      { name: "tags", weight: 1 },
    ],
    threshold: 0.4,
    includeScore: true,
  })

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      setSelectedIndex(0)
      if (!value.trim()) {
        setResults([])
        return
      }
      const res = fuse.search(value).slice(0, 8).map((r) => r.item)
      setResults(res)
    },
    [posts]
  )

  const navigateToPost = useCallback(
    (slug: string) => {
      router.push(`/blog/${slug}`)
      setOpen(false)
      setQuery("")
      setResults([])
    },
    [router]
  )

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  // Arrow key navigation inside results
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === "Enter" && results[selectedIndex]) {
        navigateToPost(results[selectedIndex].slugAsParams)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, results, selectedIndex, navigateToPost])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      setQuery("")
      setResults([])
    }
  }, [open])

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-muted/50 text-muted-foreground text-sm hover:bg-accent hover:text-foreground transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:block">Search</span>
        <kbd className="hidden sm:block text-xs border border-border bg-background rounded px-1 py-0.5 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* Dialog */}
          <div
            className="relative mx-auto mt-[12vh] max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="animate-slide-down rounded-2xl border border-border bg-card shadow-2xl shadow-black/30 overflow-hidden">

              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search articles, topics..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    onClick={() => handleSearch("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="text-xs border border-border bg-muted rounded px-1.5 py-0.5 font-mono text-muted-foreground">
                  Esc
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query && results.length === 0 && (
                  <div className="px-4 py-12 text-center text-muted-foreground">
                    <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
                    <p className="text-sm mt-1">Try different keywords</p>
                  </div>
                )}

                {results.length > 0 && (
                  <ul className="p-2">
                    {results.map((post, i) => (
                      <li key={post.slugAsParams}>
                        <button
                          onClick={() => navigateToPost(post.slugAsParams)}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={cn(
                            "w-full text-left px-4 py-3.5 rounded-xl flex items-start gap-4 transition-colors group",
                            selectedIndex === i ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Search className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-snug mb-1 truncate">
                              {post.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                              {post.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(post.date)}
                              </span>
                              {post.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ArrowRight className={cn(
                            "h-4 w-4 shrink-0 mt-1 transition-all text-muted-foreground",
                            selectedIndex === i ? "text-primary translate-x-1" : ""
                          )} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {!query && (
                  <div className="px-4 py-10 text-center text-muted-foreground">
                    <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Start typing to search all articles</p>
                    <p className="text-xs mt-2 opacity-60">Use ↑↓ arrows to navigate, Enter to open</p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
                <span>{results.length > 0 ? `${results.length} result${results.length !== 1 ? "s" : ""}` : "Type to search"}</span>
                <div className="flex items-center gap-3">
                  <span><kbd className="border border-border bg-background rounded px-1 py-0.5 font-mono">↑↓</kbd> navigate</span>
                  <span><kbd className="border border-border bg-background rounded px-1 py-0.5 font-mono">↵</kbd> open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
