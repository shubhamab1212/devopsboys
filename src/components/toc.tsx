"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { List } from "lucide-react"

interface TocItem {
  title: string
  url: string
  depth?: number
  items?: TocItem[]
}

interface TocProps {
  toc: TocItem[]
}

function flattenToc(items: TocItem[], depth = 2): TocItem[] {
  return items.flatMap((item) => [
    { ...item, depth: item.depth ?? depth },
    ...(item.items ? flattenToc(item.items, depth + 1) : []),
  ])
}

// Color accent per h2 section — cycles through a small palette
const ACCENTS = [
  { dot: "bg-blue-500",   active: "text-blue-400",   border: "border-blue-500",   bg: "bg-blue-500/10" },
  { dot: "bg-violet-500", active: "text-violet-400", border: "border-violet-500", bg: "bg-violet-500/10" },
  { dot: "bg-cyan-500",   active: "text-cyan-400",   border: "border-cyan-500",   bg: "bg-cyan-500/10" },
  { dot: "bg-emerald-500",active: "text-emerald-400",border: "border-emerald-500",bg: "bg-emerald-500/10" },
  { dot: "bg-orange-500", active: "text-orange-400", border: "border-orange-500", bg: "bg-orange-500/10" },
  { dot: "bg-pink-500",   active: "text-pink-400",   border: "border-pink-500",   bg: "bg-pink-500/10" },
]

export function TableOfContents({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  const flatItems = flattenToc(toc)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  // Assign a color group to each top-level (h2) section
  const sectionColorMap = useRef<Record<string, number>>({})
  let h2Counter = 0
  flatItems.forEach((item) => {
    if ((item.depth ?? 2) === 2) {
      const id = item.url.replace("#", "")
      if (!(id in sectionColorMap.current)) {
        sectionColorMap.current[id] = h2Counter % ACCENTS.length
        h2Counter++
      }
    }
  })

  // Build an id → color index map for sub-items too
  const colorIndexFor = (id: string, depth: number) => {
    if (depth === 2) return sectionColorMap.current[id] ?? 0
    // find the nearest preceding h2
    const idx = flatItems.findIndex((i) => i.url.replace("#", "") === id)
    for (let i = idx - 1; i >= 0; i--) {
      if ((flatItems[i].depth ?? 2) === 2) {
        const parentId = flatItems[i].url.replace("#", "")
        return sectionColorMap.current[parentId] ?? 0
      }
    }
    return 0
  }

  // Auto-scroll active TOC item into view when section changes
  useEffect(() => {
    if (!activeId) return
    const el = linkRefs.current[activeId]
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [activeId])

  useEffect(() => {
    setMounted(true)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: "-80px 0px -70% 0px" }
    )
    flatItems.forEach(({ url }) => {
      const el = document.getElementById(url.replace("#", ""))
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [flatItems])

  if (!toc || toc.length === 0) return null

  return (
    <nav>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
          <List className="h-3.5 w-3.5 text-primary" />
        </div>
        <p className="font-bold text-sm text-foreground tracking-wide uppercase">On This Page</p>
      </div>

      {/* Items */}
      <div className="relative space-y-0.5">
        {/* Vertical rail */}
        <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border/60" />

        {flatItems.map((item, idx) => {
          const id = item.url.replace("#", "")
          const isActive = activeId === id
          const depth = item.depth ?? 2
          const isH2 = depth === 2
          const colorIdx = colorIndexFor(id, depth)
          const accent = ACCENTS[colorIdx]

          return (
            <a
              key={item.url}
              href={item.url}
              ref={(el) => { linkRefs.current[id] = el }}
              style={{
                animationDelay: mounted ? `${idx * 40}ms` : "0ms",
              }}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg py-1.5 pr-2 text-sm transition-all duration-200",
                isH2 ? "pl-5" : "pl-8",
                isActive
                  ? cn("font-semibold", accent.active, accent.bg)
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                mounted ? "animate-fade-up opacity-0" : "opacity-100"
              )}
            >
              {/* Dot on the rail */}
              <span
                className={cn(
                  "absolute shrink-0 rounded-full transition-all duration-200",
                  isH2
                    ? cn("left-[3px] h-[9px] w-[9px] border-2 border-background", isActive ? accent.dot : "bg-border group-hover:bg-muted-foreground")
                    : cn("left-[5px] h-[5px] w-[5px]", isActive ? accent.dot : "bg-border group-hover:bg-muted-foreground")
                )}
              />

              {/* Title */}
              <span className="line-clamp-2 leading-snug">{item.title}</span>

              {/* Active glow indicator */}
              {isActive && (
                <span className={cn("ml-auto h-1.5 w-1.5 shrink-0 rounded-full", accent.dot)} />
              )}
            </a>
          )
        })}
      </div>

      {/* Progress hint */}
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {flatItems.findIndex((i) => i.url.replace("#", "") === activeId) + 1} / {flatItems.length} sections
        </p>
      </div>
    </nav>
  )
}
