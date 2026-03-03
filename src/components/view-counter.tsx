"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    // Increment on mount (each real page visit)
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => { if (d.views !== null) setViews(d.views) })
      .catch(() => {})
  }, [slug])

  if (views === null) return null

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Eye className="h-3.5 w-3.5" />
      {views.toLocaleString()} views
    </span>
  )
}
