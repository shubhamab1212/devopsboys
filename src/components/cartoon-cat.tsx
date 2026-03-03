"use client"

import { useEffect, useRef, useState } from "react"

type State = "entering" | "idle" | "yawning" | "alert" | "sleeping"

const QUIPS = [
  "kubectl get pods 🐾",
  "docker run -it cat:latest",
  "git push --purr 😸",
  "CI/CD = Cat Is/Cat Does",
  "ping devopsboys.com ❤️",
  "sudo apt install catnip",
  "rm -rf my_nap_time 😾",
]

export function CartoonCat() {
  const stateRef = useRef<State>("entering")
  const [state, _setState] = useState<State>("entering")
  const [blink, setBlink] = useState(false)
  const [quip, setQuip] = useState<string | null>(null)

  const scrollT = useRef<ReturnType<typeof setTimeout> | null>(null)
  const yawnT   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sleepT  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const quipT   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const blinkT  = useRef<ReturnType<typeof setTimeout> | null>(null)

  function setState(s: State) { stateRef.current = s; _setState(s) }

  // Slide in on mount
  useEffect(() => {
    const t = setTimeout(() => setState("idle"), 1300)
    return () => clearTimeout(t)
  }, [])

  // Random blink (independent of state)
  useEffect(() => {
    const next = () => {
      blinkT.current = setTimeout(() => {
        setBlink(true)
        setTimeout(() => { setBlink(false); next() }, 160)
      }, 2200 + Math.random() * 3800)
    }
    next()
    return () => clearTimeout(blinkT.current)
  }, [])

  // Yawn + sleep schedule while idle
  useEffect(() => {
    if (state !== "idle") return
    clearTimeout(yawnT.current); clearTimeout(sleepT.current)

    yawnT.current = setTimeout(() => {
      if (stateRef.current !== "idle") return
      setState("yawning")
      setTimeout(() => { if (stateRef.current === "yawning") setState("idle") }, 2700)
    }, 7000 + Math.random() * 9000)

    sleepT.current = setTimeout(() => {
      if (stateRef.current === "idle") setState("sleeping")
    }, 32000)

    return () => { clearTimeout(yawnT.current); clearTimeout(sleepT.current) }
  }, [state])

  // Scroll → alert or wake from sleep
  useEffect(() => {
    const handle = () => {
      const s = stateRef.current
      if (s === "sleeping") {
        setState("yawning")
        setTimeout(() => { if (stateRef.current === "yawning") setState("idle") }, 2700)
        return
      }
      if (s === "yawning") return
      setState("alert")
      clearTimeout(scrollT.current)
      scrollT.current = setTimeout(() => { if (stateRef.current === "alert") setState("idle") }, 2400)
    }
    window.addEventListener("scroll", handle, { passive: true })
    return () => { window.removeEventListener("scroll", handle); clearTimeout(scrollT.current) }
  }, [])

  const handleClick = () => {
    const msg = QUIPS[Math.floor(Math.random() * QUIPS.length)]
    setQuip(msg)
    clearTimeout(quipT.current)
    quipT.current = setTimeout(() => setQuip(null), 3200)
  }

  const sleeping = state === "sleeping"
  const yawning  = state === "yawning"
  const alert    = state === "alert"
  const entering = state === "entering"
  const eyesClosed = sleeping || (blink && !yawning)

  // Eye sizes
  const eyeRyOuter = eyesClosed ? 1.2 : alert ? 11.5 : 9.5
  const irisRy     = alert ? 9 : 6.5
  const pupilRx    = alert ? 1.8 : 2.8
  const pupilRy    = alert ? 8 : 6

  return (
    <div
      className="fixed bottom-3 right-3 z-50 cursor-pointer select-none"
      style={{
        transition: "transform 1s cubic-bezier(0.34,1.56,0.64,1), opacity 0.8s",
        transform: entering ? "translateX(150px)" : "translateX(0)",
        opacity: entering ? 0 : 1,
      }}
      onClick={handleClick}
      title="Click me! 🐾"
    >
      {/* Speech bubble */}
      {quip && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-xl bg-card border border-border shadow-xl text-xs font-mono text-foreground whitespace-nowrap animate-fade-up opacity-0">
          {quip}
          <div className="absolute -bottom-[7px] right-5 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
        </div>
      )}

      {/* Sleeping Z's */}
      {sleeping && (
        <div className="absolute -top-10 left-0 pointer-events-none font-black text-blue-400 leading-none">
          <span style={{ animation: "cat-zzz 2.2s ease-out infinite", display: "inline-block", fontSize: "0.9rem" }}>z</span>
          <span style={{ animation: "cat-zzz 2.2s ease-out infinite", animationDelay: "0.7s", display: "inline-block", fontSize: "1.1rem", marginLeft: "3px" }}>Z</span>
          <span style={{ animation: "cat-zzz 2.2s ease-out infinite", animationDelay: "1.4s", display: "inline-block", fontSize: "1.3rem", marginLeft: "2px" }}>Z</span>
        </div>
      )}

      {/* ── CAT SVG ───────────────────────────────────── */}
      <svg
        viewBox="0 0 84 108"
        width="84" height="108"
        xmlns="http://www.w3.org/2000/svg"
        style={sleeping ? { animation: "cat-breathe 3.2s ease-in-out infinite" } : {}}
      >
        {/* ── TAIL ──────────────────────────────── */}
        <path
          d="M 63 90 Q 84 82 80 63 Q 76 47 65 54"
          stroke="#E07A42" strokeWidth="7.5" strokeLinecap="round" fill="none"
          style={!sleeping ? {
            animation: "cat-tail-sway 2.6s ease-in-out infinite",
            transformBox: "fill-box",
            transformOrigin: "0% 100%",
          } : {}}
        />
        {/* Tail tip */}
        <circle cx="65" cy="54" r="4.5" fill="#B85A1A" />

        {/* ── LEFT EAR ──────────────────────────── */}
        <polygon points="18,34 12,8 37,27" fill="#F4A261" />
        <polygon points="21,32 16,13 35,26" fill="#FFB3C1" />

        {/* ── RIGHT EAR ─────────────────────────── */}
        <polygon points="66,34 72,8 47,27" fill="#F4A261" />
        <polygon points="63,32 68,13 49,26" fill="#FFB3C1" />

        {/* ── HEAD ──────────────────────────────── */}
        <circle cx="42" cy="44" r="29" fill="#F4A261" />

        {/* Forehead tabby stripes */}
        <path d="M 36 20 Q 42 17 48 20" stroke="#D4703A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 34 26 Q 42 22 50 26" stroke="#D4703A" strokeWidth="1.6" fill="none" strokeLinecap="round" />

        {/* ── BODY ──────────────────────────────── */}
        <ellipse cx="42" cy="87" rx="25" ry="21" fill="#F4A261" />
        {/* Belly */}
        <ellipse cx="42" cy="92" rx="15" ry="14" fill="#FEF0DC" />

        {/* ── LEFT EYE ──────────────────────────── */}
        <ellipse cx="31" cy="42" rx="9.5" ry={eyeRyOuter} fill={eyesClosed ? "#F4A261" : "white"} />
        {!eyesClosed && (
          <>
            <ellipse cx="31" cy="43" rx="6.5" ry={irisRy} fill="#22C55E" />
            <ellipse cx="31" cy="43" rx={pupilRx} ry={pupilRy} fill="#0F172A" />
            <circle cx="33.5" cy="39" r="2" fill="white" />
          </>
        )}
        {eyesClosed && (
          <path d="M 22 42 Q 31 49 40 42" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
        )}

        {/* ── RIGHT EYE ─────────────────────────── */}
        <ellipse cx="53" cy="42" rx="9.5" ry={eyeRyOuter} fill={eyesClosed ? "#F4A261" : "white"} />
        {!eyesClosed && (
          <>
            <ellipse cx="53" cy="43" rx="6.5" ry={irisRy} fill="#22C55E" />
            <ellipse cx="53" cy="43" rx={pupilRx} ry={pupilRy} fill="#0F172A" />
            <circle cx="55.5" cy="39" r="2" fill="white" />
          </>
        )}
        {eyesClosed && (
          <path d="M 44 42 Q 53 49 62 42" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
        )}

        {/* ── NOSE ──────────────────────────────── */}
        <polygon points="42,53 39,57.5 45,57.5" fill="#F9A8D4" />

        {/* ── MOUTH ─────────────────────────────── */}
        {!yawning ? (
          <path d="M 38 59 Q 42 64 46 59" fill="none" stroke="#92400E" strokeWidth="1.6" strokeLinecap="round" />
        ) : (
          <>
            {/* Yawn — wide open */}
            <path d="M 34 59 Q 42 78 50 59" fill="#7F1D1D" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="42" cy="67" rx="8" ry="7" fill="#B91C1C" />
            {/* Teeth */}
            <rect x="37" y="58.5" width="4.5" height="4" rx="0.8" fill="white" />
            <rect x="41.5" y="58.5" width="4.5" height="4" rx="0.8" fill="white" />
          </>
        )}

        {/* ── WHISKERS ──────────────────────────── */}
        <line x1="14" y1="51" x2="36" y2="54" stroke="#CBD5E1" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="12" y1="55" x2="36" y2="56" stroke="#CBD5E1" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="14" y1="59" x2="36" y2="58" stroke="#CBD5E1" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="70" y1="51" x2="48" y2="54" stroke="#CBD5E1" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="72" y1="55" x2="48" y2="56" stroke="#CBD5E1" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="70" y1="59" x2="48" y2="58" stroke="#CBD5E1" strokeWidth="1.1" strokeLinecap="round" />

        {/* ── PAWS ──────────────────────────────── */}
        <ellipse cx="30" cy="105" rx="12.5" ry="6.5" fill="#F4A261" />
        <ellipse cx="54" cy="105" rx="12.5" ry="6.5" fill="#F4A261" />
        {/* Paw toe lines */}
        <path d="M 23 104 Q 27 101 30 104" fill="none" stroke="#E07A42" strokeWidth="1" strokeLinecap="round" />
        <path d="M 25 107 Q 28 105 32 107" fill="none" stroke="#E07A42" strokeWidth="1" strokeLinecap="round" />
        <path d="M 47 104 Q 51 101 54 104" fill="none" stroke="#E07A42" strokeWidth="1" strokeLinecap="round" />
        <path d="M 49 107 Q 52 105 56 107" fill="none" stroke="#E07A42" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  )
}
