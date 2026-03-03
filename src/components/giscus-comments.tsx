"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

const REPO = "shubhamab1212/devopsboys"
const REPO_ID = "R_kgDORc0vHw"

export function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  useEffect(() => {
    if (!ref.current || !categoryId) return

    ref.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", REPO)
    script.setAttribute("data-repo-id", REPO_ID)
    script.setAttribute("data-category", "General")
    script.setAttribute("data-category-id", categoryId)
    script.setAttribute("data-mapping", "pathname")
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "top")
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark_dimmed" : "light")
    script.setAttribute("data-lang", "en")
    script.setAttribute("data-loading", "lazy")
    script.crossOrigin = "anonymous"
    script.async = true

    ref.current.appendChild(script)
  }, [resolvedTheme, categoryId])

  if (!categoryId) return null

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">Comments</h2>
      <div className="rounded-xl border border-border bg-card p-4">
        <div ref={ref} />
      </div>
    </div>
  )
}
