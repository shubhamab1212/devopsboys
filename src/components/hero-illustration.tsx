"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const STARS = [
  { x: 30,  y: 22,  r: 1.5, d: 0    },
  { x: 65,  y: 38,  r: 1,   d: 0.6  },
  { x: 105, y: 16,  r: 2,   d: 1.2  },
  { x: 148, y: 30,  r: 1,   d: 0.3  },
  { x: 52,  y: 58,  r: 1.5, d: 1.8  },
  { x: 22,  y: 52,  r: 1,   d: 0.9  },
  { x: 82,  y: 62,  r: 1,   d: 2.1  },
  { x: 125, y: 48,  r: 1.5, d: 0.4  },
  { x: 168, y: 28,  r: 1,   d: 1.5  },
  { x: 35,  y: 85,  r: 1,   d: 0.7  },
  { x: 338, y: 85,  r: 1.5, d: 1.0  },
  { x: 385, y: 62,  r: 1,   d: 2.4  },
  { x: 408, y: 28,  r: 1,   d: 0.2  },
  { x: 395, y: 98,  r: 1.5, d: 1.6  },
  { x: 20,  y: 110, r: 1,   d: 0.8  },
]

const RAIN = [
  { x: 18,  delay: "0s"     },
  { x: 50,  delay: "-0.3s"  },
  { x: 88,  delay: "-0.7s"  },
  { x: 118, delay: "-0.1s"  },
  { x: 152, delay: "-0.5s"  },
  { x: 180, delay: "-0.9s"  },
  { x: 215, delay: "-0.2s"  },
  { x: 252, delay: "-0.6s"  },
  { x: 290, delay: "-0.4s"  },
  { x: 332, delay: "-0.8s"  },
  { x: 368, delay: "-1.1s"  },
  { x: 398, delay: "-0.15s" },
  { x: 62,  delay: "-0.75s" },
  { x: 162, delay: "-0.35s" },
  { x: 312, delay: "-0.55s" },
]

export function HeroIllustration() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const N = !mounted || resolvedTheme === "dark"

  // Semi-transparent hill fills — blend on both light and dark page bg
  const hillFar  = N ? "oklch(0.22 0.07 250 / 0.65)" : "oklch(0.72 0.05 200 / 0.45)"
  const hillMid  = N ? "oklch(0.18 0.06 140 / 0.75)" : "oklch(0.58 0.11 140 / 0.50)"
  const hillNear = N ? "oklch(0.14 0.07 135 / 0.85)" : "oklch(0.50 0.13 135 / 0.60)"

  return (
    <div className="relative select-none w-full" aria-hidden="true">
      <svg
        viewBox="0 0 420 300"
        className="w-full max-w-[480px] mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="h-roof-d" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="h-roof-n" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="h-shadow">
            <feDropShadow dx="0" dy="8" stdDeviation="14"
              floodColor="#000" floodOpacity={N ? 0.55 : 0.18} />
          </filter>
          {/* Clip developer to window interior */}
          <clipPath id="win-clip">
            <rect x="174" y="169" width="92" height="74" />
          </clipPath>
        </defs>

        {/* ── STARS (night) ─────────────────────────────── */}
        {N && STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e2e8f0"
            style={{
              animation: `star-twinkle-${i % 3} ${2.5 + (i % 3) * 0.8}s ease-in-out infinite`,
              animationDelay: `${s.d}s`,
            }}
          />
        ))}

        {/* ── BIRDS (day) ───────────────────────────────── */}
        {!N && [
          { delay: "0s"  },
          { delay: "-4s" },
          { delay: "-7s" },
        ].map((b, i) => (
          <g key={i}
            style={{ animation: "bird-fly 10s linear infinite", animationDelay: b.delay }}
            fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"
          >
            <path d={`M ${-30 + i * 20} ${38 + i * 15} Q ${-23 + i * 20} ${32 + i * 15} ${-16 + i * 20} ${38 + i * 15}`} />
            <path d={`M ${-16 + i * 20} ${38 + i * 15} Q ${-9 + i * 20} ${32 + i * 15} ${-2 + i * 20} ${38 + i * 15}`} />
          </g>
        ))}

        {/* ── MOON (night) ──────────────────────────────── */}
        {N && (
          <g style={{ animation: "float 10s ease-in-out infinite" }}>
            <circle cx="362" cy="50" r="28" fill="#fef9c3" opacity="0.06" />
            <circle cx="362" cy="50" r="20" fill="#fef9c3" opacity="0.12" />
            <circle cx="362" cy="50" r="16" fill="#fef9c3" />
            <circle cx="371" cy="45" r="13" fill="oklch(0.12 0.08 250)" />
            <circle cx="352" cy="44" r="1.8" fill="#fde68a" opacity="0.45" />
            <circle cx="358" cy="54" r="1.3" fill="#fde68a" opacity="0.35" />
          </g>
        )}

        {/* ── SUN (day) ─────────────────────────────────── */}
        {!N && (
          <g style={{ transformOrigin: "362px 50px", animation: "sun-spin 25s linear infinite" }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
              const rad = (a * Math.PI) / 180
              return (
                <line key={i}
                  x1={362 + Math.cos(rad) * 24} y1={50 + Math.sin(rad) * 24}
                  x2={362 + Math.cos(rad) * 32} y2={50 + Math.sin(rad) * 32}
                  stroke="#fde047" strokeWidth="2.5" strokeLinecap="round"
                />
              )
            })}
            <circle cx="362" cy="50" r="18" fill="#fde047" />
            <circle cx="362" cy="50" r="14" fill="#fef08a" />
            <circle cx="357" cy="48" r="1.8" fill="#ca8a04" />
            <circle cx="367" cy="48" r="1.8" fill="#ca8a04" />
            <path d="M 357 54 Q 362 58 367 54"
              stroke="#ca8a04" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* ── FAR MOUNTAINS ─────────────────────────────── */}
        <path
          d="M 0 222 C 40 198, 95 190, 145 208 C 195 226, 248 184, 305 200 C 348 212, 390 188, 420 202 L 420 300 L 0 300 Z"
          fill={hillFar}
        />

        {/* ── NEAR HILLS ────────────────────────────────── */}
        <path
          d="M 0 252 C 55 234, 115 230, 165 244 C 215 258, 278 228, 338 242 C 375 252, 402 248, 420 252 L 420 300 L 0 300 Z"
          fill={hillMid}
        />

        {/* ── FOREGROUND GRASS ──────────────────────────── */}
        <path
          d="M 0 272 C 65 266, 135 270, 205 274 C 275 278, 355 266, 420 272 L 420 300 L 0 300 Z"
          fill={hillNear}
        />

        {/* ── HOUSE SHADOW ──────────────────────────────── */}
        <ellipse cx="222" cy="284" rx="95" ry="9"
          fill="#000" opacity={N ? 0.30 : 0.10} />

        {/* ── HOUSE BODY ────────────────────────────────── */}
        <rect x="148" y="155" width="148" height="120" rx="4"
          fill={N ? "#1e293b" : "#e2e8f0"}
          stroke={N ? "#334155" : "#94a3b8"} strokeWidth="1.5"
        />
        {/* Brick lines */}
        {[176, 199, 222, 245, 268].map(y => (
          <line key={y} x1="150" x2="294" y1={y} y2={y}
            stroke={N ? "#263548" : "#b3c4d4"} strokeWidth="0.5" opacity="0.5" />
        ))}

        {/* ── ROOF ──────────────────────────────────────── */}
        <polygon
          points="136,157 222,76 308,157"
          fill={N ? "url(#h-roof-n)" : "url(#h-roof-d)"}
          stroke={N ? "#334155" : "#94a3b8"} strokeWidth="1.5"
          filter="url(#h-shadow)"
        />
        {/* Roof overhang accent */}
        <line x1="134" y1="157" x2="310" y2="157"
          stroke={N ? "#475569" : "#64748b"} strokeWidth="3" strokeLinecap="round" />

        {/* ── CHIMNEY ───────────────────────────────────── */}
        <rect x="260" y="90" width="20" height="38" rx="2"
          fill={N ? "#1e293b" : "#94a3b8"}
          stroke={N ? "#334155" : "#64748b"} strokeWidth="1"
        />
        <rect x="257" y="88" width="26" height="6" rx="2"
          fill={N ? "#334155" : "#64748b"} />
        {/* Chimney smoke (night) */}
        {N && <>
          <path d="M 266 86 Q 262 78 266 70 Q 270 62 266 54"
            stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round"
            style={{ animation: "steam-rise 3s ease-out infinite" }} opacity="0.55" />
          <path d="M 273 85 Q 277 77 273 69"
            stroke="#64748b" strokeWidth="1.5" fill="none" strokeLinecap="round"
            style={{ animation: "steam-rise 2.5s ease-out infinite", animationDelay: "-1.2s" }} opacity="0.38" />
        </>}

        {/* ── WINDOW GLOW (night) ───────────────────────── */}
        {N && (
          <rect x="162" y="160" width="116" height="90" rx="4"
            fill="#fbbf24" opacity="0.14"
            style={{ filter: "blur(18px)", animation: "window-glow-pulse 3s ease-in-out infinite" }}
          />
        )}

        {/* ── MAIN WINDOW FRAME ─────────────────────────── */}
        <rect x="168" y="164" width="104" height="82" rx="4"
          fill={N ? "#1e2a3a" : "#64748b"}
          stroke={N ? "#475569" : "#94a3b8"} strokeWidth="2"
        />

        {/* ── WINDOW GLASS ──────────────────────────────── */}
        {/* Back wall */}
        <rect x="172" y="168" width="96" height="48" rx="1"
          fill={N ? "#1a0e08" : "#eff6ff"} />
        {/* Floor strip */}
        <rect x="172" y="216" width="96" height="26" rx="0"
          fill={N ? "#2c1810" : "#e2e8f0"} />

        {/* ── DESK ──────────────────────────────────────── */}
        <rect x="172" y="224" width="96" height="4" rx="1"
          fill={N ? "#7c3726" : "#94a3b8"} />
        <rect x="173" y="228" width="3" height="14" fill={N ? "#5a2a1c" : "#64748b"} />
        <rect x="265" y="228" width="3" height="14" fill={N ? "#5a2a1c" : "#64748b"} />

        {/* ── DEVELOPER — flipped to face LEFT ──────────── */}
        {/* translate(440,0) scale(-1,1) mirrors around x=220 (window center) */}
        <g transform="translate(440,0) scale(-1,1)" clipPath="url(#win-clip)">
          {/* Hoodie */}
          <rect x="210" y="208" width="20" height="16" rx="5"
            fill={N ? "#1d4ed8" : "#3b82f6"} />
          <rect x="216" y="214" width="8" height="6" rx="2"
            fill={N ? "#1e40af" : "#2563eb"} />
          {/* Head */}
          <circle cx="220" cy="199" r="10" fill="#fcd5b5" />
          {/* Hair */}
          <ellipse cx="220" cy="191" rx="10" ry="5.5" fill={N ? "#1c1917" : "#292524"} />
          <rect x="210" y="191" width="20" height="6" fill={N ? "#1c1917" : "#292524"} />
          {/* Ears */}
          <ellipse cx="210" cy="200" rx="2" ry="2.5" fill="#f5c5a5" />
          <ellipse cx="230" cy="200" rx="2" ry="2.5" fill="#f5c5a5" />
          {/* Eyes */}
          <ellipse cx="216" cy="200" rx="1.8" ry="2.2"
            fill={N ? "#c8d8f0" : "#1e3a5f"}
            style={{ animation: "dev-blink 4s ease-in-out infinite" }}
          />
          <ellipse cx="224" cy="200" rx="1.8" ry="2.2"
            fill={N ? "#c8d8f0" : "#1e3a5f"}
            style={{ animation: "dev-blink 4s ease-in-out infinite" }}
          />
          {/* Nose */}
          <ellipse cx="220" cy="204" rx="1" ry="0.8" fill="#e8a98a" />
          {/* Smile */}
          <path d="M 216 207 Q 220 210 224 207"
            stroke="#cc8866" strokeWidth="1" fill="none" strokeLinecap="round" />
          {/* Laptop face glow (night) */}
          {N && <ellipse cx="220" cy="201" rx="10" ry="8" fill="#3b82f6" opacity="0.20" />}
          {/* Arms */}
          <path d="M 210 214 Q 204 219 202 224"
            stroke="#fcd5b5" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 230 214 Q 236 219 238 224"
            stroke="#fcd5b5" strokeWidth="4.5" fill="none" strokeLinecap="round" />

          {/* ── LAPTOP ──────────────────────────────────── */}
          <rect x="202" y="205" width="28" height="20" rx="2"
            fill={N ? "#0d1117" : "#1e293b"}
            stroke={N ? "#30363d" : "#334155"} strokeWidth="1"
          />
          {N && <rect x="203" y="206" width="26" height="18" rx="1" fill="#0d2040" />}
          <rect x="205" y="208" width="12" height="1.8" rx="0.5" fill="#4ade80" opacity="0.95" />
          <rect x="205" y="211" width="20" height="1.8" rx="0.5" fill="#60a5fa" opacity="0.95" />
          <rect x="205" y="214" width="15" height="1.8" rx="0.5" fill="#4ade80" opacity="0.95" />
          <rect x="205" y="217" width="9"  height="1.8" rx="0.5" fill="#f472b6" opacity="0.95" />
          <rect x="205" y="220" width="5"  height="1.8" rx="0.5" fill="#60a5fa"
            style={{ animation: "cursor-blink 1s steps(1) infinite" }}
          />
          <rect x="200" y="224" width="32" height="3" rx="1" fill={N ? "#1e293b" : "#334155"} />
          <rect x="202" y="223" width="28" height="2" rx="1" fill={N ? "#334155" : "#475569"} />

          {/* ── COFFEE MUG ──────────────────────────────── */}
          <rect x="236" y="213" width="13" height="11" rx="2"
            fill={N ? "#92400e" : "#b45309"} />
          <ellipse cx="242" cy="213" rx="5.5" ry="1.8" fill={N ? "#78350f" : "#92400e"} />
          <ellipse cx="242" cy="213.5" rx="4.5" ry="1.3" fill={N ? "#451a03" : "#7c2d12"} />
          <path d="M 249 215 Q 254 215 254 219 Q 254 222 249 222"
            stroke={N ? "#92400e" : "#b45309"} strokeWidth="1.8" fill="none" />
          <ellipse cx="242" cy="224" rx="6.5" ry="1.8" fill={N ? "#78350f" : "#92400e"} />
          {N && <>
            <path d="M 238 211 Q 236 206 238 201 Q 240 196 238 191"
              stroke="#9ca3af" strokeWidth="1.2" fill="none" strokeLinecap="round"
              style={{ animation: "steam-rise 2.2s ease-out infinite" }} opacity="0.7" />
            <path d="M 244 210 Q 246 205 244 200"
              stroke="#9ca3af" strokeWidth="1.2" fill="none" strokeLinecap="round"
              style={{ animation: "steam-rise 2.8s ease-out infinite", animationDelay: "-1s" }} opacity="0.5" />
          </>}

          {/* ── RUBBER DUCK ─────────────────────────────── */}
          <ellipse cx="196" cy="222" rx="5" ry="3.5" fill="#fbbf24" />
          <circle cx="200" cy="218" r="4" fill="#fbbf24" />
          <ellipse cx="204" cy="218" rx="2.5" ry="1.2" fill="#f97316" />
          <circle cx="201" cy="216.5" r="1" fill="#1c1917" />
          <circle cx="201.5" cy="216" r="0.4" fill="white" />
          <ellipse cx="195" cy="222.5" rx="3" ry="2" fill="#f59e0b" opacity="0.7" />
        </g>

        {/* ── WINDOW CROSS DIVIDERS (on top of interior) ── */}
        <line x1="172" x2="268" y1="210" y2="210"
          stroke={N ? "#2d3e50" : "#64748b"} strokeWidth="1.5" opacity="0.7" />
        <line x1="220" x2="220" y1="168" y2="246"
          stroke={N ? "#2d3e50" : "#64748b"} strokeWidth="1.5" opacity="0.7" />

        {/* ── DOOR ──────────────────────────────────────── */}
        <rect x="196" y="242" width="38" height="33" rx="4"
          fill={N ? "#1e293b" : "#94a3b8"}
          stroke={N ? "#334155" : "#64748b"} strokeWidth="1"
        />
        <rect x="204" y="248" width="22" height="12" rx="2"
          fill={N ? "#0f172a" : "#bfdbfe"} />
        <circle cx="230" cy="261" r="2.5" fill={N ? "#fbbf24" : "#f59e0b"} />

        {/* ── TREE (left of house) ──────────────────────── */}
        <rect x="112" y="225" width="7" height="42" rx="3"
          fill={N ? "#5a3020" : "#92400e"} />
        <circle cx="115" cy="212" r="20"
          fill={N ? "#14532d" : "#15803d"} />
        <circle cx="105" cy="222" r="15"
          fill={N ? "#166534" : "#16a34a"} />
        <circle cx="125" cy="222" r="15"
          fill={N ? "#14532d" : "#22c55e"} />
        <circle cx="115" cy="204" r="14"
          fill={N ? "#166534" : "#4ade80"} />

        {/* ── FLOWERS (day only) ────────────────────────── */}
        {!N && [[62,272],[84,278],[338,274],[358,270]].map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y - 10} stroke="#16a34a" strokeWidth="1.5" />
            <circle cx={x} cy={y - 12} r="4.5"
              fill={["#f472b6","#fbbf24","#60a5fa","#f97316"][i]} />
          </g>
        ))}

        {/* ── RAIN (night, topmost) ─────────────────────── */}
        {N && RAIN.map((r, i) => (
          <line key={i}
            x1={r.x} y1={-20}
            x2={r.x - 5} y2={16}
            stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round"
            opacity="0.48"
            style={{ animation: "rain-fall 1.4s linear infinite", animationDelay: r.delay }}
          />
        ))}
      </svg>
    </div>
  )
}
