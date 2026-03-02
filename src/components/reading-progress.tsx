"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[3px] transition-all duration-100 ease-out"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, oklch(0.65 0.2 250), oklch(0.7 0.22 290), oklch(0.65 0.2 200))",
        boxShadow: "0 0 8px oklch(0.65 0.2 250 / 0.6)",
      }}
    />
  )
}
