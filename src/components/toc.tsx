"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

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

export function TableOfContents({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string>("")
  const flatItems = flattenToc(toc)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0px -70% 0px" }
    )

    flatItems.forEach(({ url }) => {
      const id = url.replace("#", "")
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [flatItems])

  if (!toc || toc.length === 0) return null

  return (
    <nav className="space-y-1">
      <p className="font-semibold text-sm mb-3 text-foreground">Table of Contents</p>
      {flatItems.map((item) => {
        const id = item.url.replace("#", "")
        const isActive = activeId === id
        return (
          <a
            key={item.url}
            href={item.url}
            className={cn(
              "block text-sm py-1 border-l-2 transition-all",
              (item.depth ?? 2) === 2 ? "pl-3" : "pl-6",
              isActive
                ? "text-primary border-primary font-medium"
                : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
            )}
          >
            {item.title}
          </a>
        )
      })}
    </nav>
  )
}
