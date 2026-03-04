"use client"

import { useState, useEffect } from "react"
import { ThumbsUp } from "lucide-react"

interface InterestButtonProps {
  product: string
}

export function InterestButton({ product }: InterestButtonProps) {
  const [clicked, setClicked] = useState(false)
  const [loading, setLoading] = useState(false)

  const storageKey = `interested:${product}`

  useEffect(() => {
    if (localStorage.getItem(storageKey) === "1") {
      setClicked(true)
    }
  }, [storageKey])

  async function handleClick() {
    if (clicked || loading) return
    setLoading(true)

    try {
      await fetch(`/api/interest/${product}`, { method: "POST" })
      localStorage.setItem(storageKey, "1")
      setClicked(true)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  if (clicked) {
    return (
      <div className="w-full flex flex-col items-center gap-1.5">
        <div className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <ThumbsUp className="h-4 w-4 fill-emerald-400" />
          Noted! We&apos;ll notify you
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          We&apos;ll email you when it&apos;s live
        </p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center gap-1.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm border border-border bg-card hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-violet-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ThumbsUp className="h-4 w-4" />
        {loading ? "Saving..." : "I'm Interested"}
      </button>
      <p className="text-[11px] text-muted-foreground text-center">
        Coming soon — tap to show interest
      </p>
    </div>
  )
}
