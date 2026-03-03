"use client"

import { useState, useEffect } from "react"

const WORDS = [
  { text: "DevOps & Cloud",  cls: "from-blue-400 via-violet-400 to-cyan-400"      },
  { text: "Kubernetes",      cls: "from-violet-400 via-indigo-400 to-blue-400"    },
  { text: "Docker",          cls: "from-cyan-400 via-sky-400 to-blue-400"         },
  { text: "AWS",             cls: "from-orange-400 via-amber-400 to-yellow-400"   },
  { text: "CI/CD",           cls: "from-emerald-400 via-teal-400 to-cyan-400"     },
]

export function HeroCyclingWord() {
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % WORDS.length)
        setShow(true)
      }, 380)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      className={`inline-block bg-gradient-to-r ${WORDS[idx].cls} bg-clip-text text-transparent`}
      style={{
        transition: "opacity 0.38s ease, transform 0.38s ease",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0px)" : "translateY(-14px)",
      }}
    >
      {WORDS[idx].text}
    </span>
  )
}
