"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

// Pre-defined star positions to avoid hydration mismatch
const STARS = [
  { x: 18,  y: 18,  r: 1.5, d: 0    },
  { x: 45,  y: 32,  r: 1,   d: 0.6  },
  { x: 72,  y: 14,  r: 2,   d: 1.2  },
  { x: 98,  y: 28,  r: 1,   d: 0.3  },
  { x: 128, y: 16,  r: 1.5, d: 1.8  },
  { x: 160, y: 38,  r: 1,   d: 0.9  },
  { x: 188, y: 18,  r: 1.5, d: 2.1  },
  { x: 215, y: 32,  r: 1,   d: 0.4  },
  { x: 268, y: 22,  r: 2,   d: 1.5  },
  { x: 252, y: 50,  r: 1,   d: 0.7  },
  { x: 30,  y: 55,  r: 1.5, d: 1.0  },
  { x: 82,  y: 58,  r: 1,   d: 2.4  },
  { x: 118, y: 45,  r: 1,   d: 0.2  },
  { x: 246, y: 68,  r: 1.5, d: 1.6  },
  { x: 284, y: 40,  r: 1,   d: 0.8  },
]

// Rain drops
const RAIN = [
  { x: 25,  delay: "0s"    },
  { x: 55,  delay: "-0.3s" },
  { x: 85,  delay: "-0.7s" },
  { x: 112, delay: "-0.1s" },
  { x: 142, delay: "-0.5s" },
  { x: 168, delay: "-0.9s" },
  { x: 198, delay: "-0.2s" },
  { x: 228, delay: "-0.6s" },
  { x: 258, delay: "-0.4s" },
  { x: 282, delay: "-0.8s" },
  { x: 40,  delay: "-1.1s" },
  { x: 70,  delay: "-0.15s"},
  { x: 130, delay: "-0.75s"},
  { x: 190, delay: "-0.35s"},
  { x: 248, delay: "-0.55s"},
]

export function HeroIllustration() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const N = !mounted || resolvedTheme === "dark" // isNight

  return (
    <div className="relative select-none animate-float" aria-hidden="true">
      <svg
        viewBox="0 0 300 370"
        className="w-full max-w-[380px] mx-auto drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sky-d" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="sky-n" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#080818" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="ground-d" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="ground-n" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="build-d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="build-n" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="glow-sm">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ── SKY ───────────────────────────────────────── */}
        <rect x="0" y="0" width="300" height="252" fill={N ? "url(#sky-n)" : "url(#sky-d)"} />

        {/* ── STARS (night) ─────────────────────────────── */}
        {N && STARS.map((s, i) => (
          <circle
            key={i} cx={s.x} cy={s.y} r={s.r} fill="#e2e8f0"
            style={{ animation: `star-twinkle-${i % 3} ${2.5 + (i % 3) * 0.8}s ease-in-out infinite`, animationDelay: `${s.d}s` }}
          />
        ))}

        {/* ── BIRDS (day) ───────────────────────────────── */}
        {!N && [
          { x: -30, y: 50, s: "0s"  },
          { x: -60, y: 30, s: "-3s" },
          { x: -20, y: 65, s: "-6s" },
        ].map((b, i) => (
          <g key={i} style={{ animation: `bird-fly 9s linear infinite`, animationDelay: b.s }}
            fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round">
            <path d={`M ${b.x} ${b.y} Q ${b.x+6} ${b.y-5} ${b.x+12} ${b.y}`} />
            <path d={`M ${b.x+12} ${b.y} Q ${b.x+18} ${b.y-5} ${b.x+24} ${b.y}`} />
          </g>
        ))}

        {/* ── MOON (night) ──────────────────────────────── */}
        {N && (
          <g style={{ animation: "float 10s ease-in-out infinite" }}>
            <circle cx="248" cy="52" r="30" fill="#fef9c3" opacity="0.07" />
            <circle cx="248" cy="52" r="22" fill="#fef9c3" opacity="0.12" />
            <circle cx="248" cy="52" r="18" fill="#fef9c3" />
            <circle cx="258" cy="47" r="15" fill="#1e1b4b" />
            <circle cx="240" cy="47" r="2"   fill="#fde68a" opacity="0.45" />
            <circle cx="246" cy="56" r="1.5" fill="#fde68a" opacity="0.35" />
          </g>
        )}

        {/* ── SUN (day) ─────────────────────────────────── */}
        {!N && (
          <g style={{ transformOrigin: "248px 52px", animation: "sun-spin 25s linear infinite" }}>
            {[0,45,90,135,180,225,270,315].map((a, i) => {
              const rad = (a * Math.PI) / 180
              return (
                <line key={i}
                  x1={248 + Math.cos(rad) * 27} y1={52 + Math.sin(rad) * 27}
                  x2={248 + Math.cos(rad) * 36} y2={52 + Math.sin(rad) * 36}
                  stroke="#fde047" strokeWidth="3" strokeLinecap="round"
                />
              )
            })}
            <circle cx="248" cy="52" r="20" fill="#fde047" />
            <circle cx="248" cy="52" r="16" fill="#fef08a" />
            {/* Cute sun face */}
            <circle cx="243" cy="50" r="1.8" fill="#ca8a04" />
            <circle cx="253" cy="50" r="1.8" fill="#ca8a04" />
            <path d="M 243 56 Q 248 60 253 56" stroke="#ca8a04" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* ── GROUND ────────────────────────────────────── */}
        <rect x="0" y="252" width="300" height="118" fill={N ? "url(#ground-n)" : "url(#ground-d)"} />
        <line x1="0" y1="252" x2="300" y2="252" stroke={N ? "#334155" : "#cbd5e1"} strokeWidth="1.5" />

        {/* ── STREET LAMP ───────────────────────────────── */}
        <rect x="37" y="210" width="4" height="46" rx="2" fill={N ? "#475569" : "#64748b"} />
        <path d="M 39 210 Q 39 198 52 198" stroke={N ? "#475569" : "#64748b"} strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="48" y="194" width="14" height="7" rx="3" fill={N ? "#1e293b" : "#475569"} />
        {N && <>
          <ellipse cx="55" cy="198" rx="20" ry="14" fill="#fef9c3" opacity="0.07" />
          <ellipse cx="55" cy="202" rx="13" ry="9"  fill="#fef9c3" opacity="0.11" />
          <circle  cx="55" cy="198" r="4"            fill="#fde047" opacity="0.9" />
        </>}

        {/* ── BUILDING ──────────────────────────────────── */}
        <rect x="58" y="88" width="185" height="170"
          rx="6" filter="url(#shadow)"
          fill={N ? "url(#build-n)" : "url(#build-d)"}
          stroke={N ? "#334155" : "#94a3b8"} strokeWidth="1.5"
        />
        {/* Brick detail lines */}
        {[108,128,148,168,188,208,228,248].map(y => (
          <line key={y} x1="60" x2="241" y1={y} y2={y}
            stroke={N ? "#263548" : "#aebdcc"} strokeWidth="0.5" opacity="0.5" />
        ))}
        {/* Top ledge */}
        <rect x="52" y="84" width="196" height="10" rx="3"
          fill={N ? "#1e293b" : "#94a3b8"} />

        {/* ── SIDE WINDOWS ──────────────────────────────── */}
        {[[70,108],[198,108],[70,194],[198,194]].map(([x,y], i) => (
          <g key={i}>
            <rect x={x} y={y} width="38" height="32" rx="3"
              fill={N ? "#0f172a" : "#dbeafe"}
              stroke={N ? "#334155" : "#93c5fd"} strokeWidth="1"
            />
            {N && i === 0 && <rect x={x+1} y={y+1} width="36" height="30" rx="2" fill="#fbbf24" opacity="0.18" />}
            {N && i === 2 && <rect x={x+1} y={y+1} width="36" height="30" rx="2" fill="#3b82f6" opacity="0.12" />}
          </g>
        ))}

        {/* ── MAIN WINDOW GLOW (night) ──────────────────── */}
        {N && (
          <rect x="111" y="136" width="80" height="90" rx="4"
            fill="#fbbf24" opacity="0.18"
            style={{ filter: "blur(14px)", animation: "window-glow-pulse 3s ease-in-out infinite" }}
          />
        )}

        {/* ── MAIN WINDOW FRAME ─────────────────────────── */}
        <rect x="116" y="140" width="70" height="82" rx="4"
          fill={N ? "#1e2a3a" : "#64748b"}
          stroke={N ? "#475569" : "#94a3b8"} strokeWidth="2"
        />

        {/* ── WINDOW GLASS / INTERIOR ───────────────────── */}
        {/* Room ceiling + back wall */}
        <rect x="120" y="144" width="62" height="42" rx="2"
          fill={N ? "#1a0e08" : "#eff6ff"} />
        {/* Room floor */}
        <rect x="120" y="186" width="62" height="32" rx="0"
          fill={N ? "#2c1810" : "#e2e8f0"} />
        {/* Wall shelf (subtle) */}
        {N && <rect x="155" y="158" width="24" height="3" rx="1" fill="#3d2010" />}

        {/* ── DESK ──────────────────────────────────────── */}
        <rect x="120" y="196" width="62" height="4" rx="1"
          fill={N ? "#7c3726" : "#94a3b8"} />
        <rect x="121" y="200" width="3" height="18" fill={N ? "#5a2a1c" : "#64748b"} />
        <rect x="178" y="200" width="3" height="18" fill={N ? "#5a2a1c" : "#64748b"} />

        {/* ── DEVELOPER BODY ────────────────────────────── */}
        {/* Hoodie/shirt */}
        <rect x="141" y="181" width="20" height="15" rx="5"
          fill={N ? "#1d4ed8" : "#3b82f6"} />
        {/* Hoodie pocket */}
        <rect x="147" y="186" width="8" height="6" rx="2"
          fill={N ? "#1e40af" : "#2563eb"} />

        {/* ── DEVELOPER HEAD ────────────────────────────── */}
        <circle cx="151" cy="172" r="10" fill="#fcd5b5" />
        {/* Hair */}
        <ellipse cx="151" cy="164" rx="10" ry="5.5" fill={N ? "#1c1917" : "#292524"} />
        <rect x="141" y="163" width="20" height="7" fill={N ? "#1c1917" : "#292524"} />
        {/* Ears */}
        <ellipse cx="141" cy="173" rx="2" ry="2.5" fill="#f5c5a5" />
        <ellipse cx="161" cy="173" rx="2" ry="2.5" fill="#f5c5a5" />
        {/* Eyes */}
        <ellipse cx="147" cy="172" rx="1.8" ry="2.2"
          fill={N ? "#c8d8f0" : "#1e3a5f"}
          style={{ animation: "dev-blink 4s ease-in-out infinite" }}
        />
        <ellipse cx="155" cy="172" rx="1.8" ry="2.2"
          fill={N ? "#c8d8f0" : "#1e3a5f"}
          style={{ animation: "dev-blink 4s ease-in-out infinite" }}
        />
        {/* Nose */}
        <ellipse cx="151" cy="176" rx="1" ry="0.8" fill="#e8a98a" />
        {/* Smile */}
        <path d="M 147 179 Q 151 182 155 179" stroke="#cc8866" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Laptop glow on face (night) */}
        {N && <ellipse cx="151" cy="174" rx="10" ry="8" fill="#3b82f6" opacity="0.18" />}

        {/* ── ARMS ──────────────────────────────────────── */}
        <path d="M 141 187 Q 135 192 133 196" stroke="#fcd5b5" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M 161 187 Q 167 192 169 196" stroke="#fcd5b5" strokeWidth="4.5" fill="none" strokeLinecap="round" />

        {/* ── LAPTOP SCREEN ─────────────────────────────── */}
        <rect x="131" y="178" width="28" height="20" rx="2"
          fill={N ? "#0d1117" : "#1e293b"}
          stroke={N ? "#30363d" : "#334155"} strokeWidth="1"
        />
        {/* Screen glow background */}
        {N && <rect x="132" y="179" width="26" height="18" rx="1" fill="#0d2040" />}
        {/* Code lines */}
        <rect x="134" y="181" width="12" height="1.8" rx="0.5" fill="#4ade80" opacity="0.95" />
        <rect x="134" y="184" width="20" height="1.8" rx="0.5" fill="#60a5fa" opacity="0.95" />
        <rect x="134" y="187" width="15" height="1.8" rx="0.5" fill="#4ade80" opacity="0.95" />
        <rect x="134" y="190" width="9"  height="1.8" rx="0.5" fill="#f472b6" opacity="0.95" />
        <rect x="134" y="193" width="5"  height="1.8" rx="0.5" fill="#60a5fa" opacity="0.9"
          style={{ animation: "cursor-blink 1s steps(1) infinite" }}
        />
        {/* Laptop base */}
        <rect x="129" y="197" width="32" height="3" rx="1" fill={N ? "#1e293b" : "#334155"} />
        {/* Hinge */}
        <rect x="131" y="196" width="28" height="2" rx="1" fill={N ? "#334155" : "#475569"} />

        {/* ── COFFEE MUG ────────────────────────────────── */}
        <rect x="163" y="186" width="14" height="12" rx="2"
          fill={N ? "#92400e" : "#b45309"} />
        {/* Mug opening */}
        <ellipse cx="170" cy="186" rx="6" ry="2" fill={N ? "#78350f" : "#92400e"} />
        {/* Coffee liquid */}
        <ellipse cx="170" cy="186.5" rx="5" ry="1.5" fill={N ? "#451a03" : "#7c2d12"} />
        {/* Handle */}
        <path d="M 177 188 Q 182 188 182 192 Q 182 196 177 196"
          stroke={N ? "#92400e" : "#b45309"} strokeWidth="2" fill="none" />
        {/* Mug bottom */}
        <ellipse cx="170" cy="198" rx="7" ry="2" fill={N ? "#78350f" : "#92400e"} />
        {/* Steam (night) */}
        {N && <>
          <path d="M 167 183 Q 165 178 167 173 Q 169 168 167 163"
            stroke="#9ca3af" strokeWidth="1.2" fill="none" strokeLinecap="round"
            style={{ animation: "steam-rise 2.2s ease-out infinite" }} opacity="0.7" />
          <path d="M 172 182 Q 174 177 172 172"
            stroke="#9ca3af" strokeWidth="1.2" fill="none" strokeLinecap="round"
            style={{ animation: "steam-rise 2.8s ease-out infinite", animationDelay: "-1s" }} opacity="0.5" />
        </>}

        {/* ── RUBBER DUCK ───────────────────────────────── */}
        {/* Duck body */}
        <ellipse cx="126" cy="194" rx="5" ry="3.5" fill="#fbbf24" />
        {/* Duck head */}
        <circle cx="130" cy="190" r="4" fill="#fbbf24" />
        {/* Duck bill */}
        <ellipse cx="134" cy="190" rx="2.5" ry="1.2" fill="#f97316" />
        {/* Duck eye */}
        <circle cx="131" cy="188.5" r="1" fill="#1c1917" />
        <circle cx="131.5" cy="188" r="0.4" fill="white" />
        {/* Duck wing */}
        <ellipse cx="125" cy="194.5" rx="3" ry="2" fill="#f59e0b" opacity="0.7" />
        {/* Duck tail */}
        <path d="M 121 193 Q 119 190 121 188" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* ── WINDOW CROSS DIVIDERS (on top of interior) ── */}
        <line x1="120" x2="182" y1="181" y2="181"
          stroke={N ? "#2d3e50" : "#64748b"} strokeWidth="1.5" opacity="0.7" />
        <line x1="151" x2="151" y1="144" y2="222"
          stroke={N ? "#2d3e50" : "#64748b"} strokeWidth="1.5" opacity="0.7" />

        {/* ── DOOR ──────────────────────────────────────── */}
        <rect x="128" y="228" width="46" height="30" rx="4"
          fill={N ? "#1e293b" : "#94a3b8"}
          stroke={N ? "#334155" : "#64748b"} strokeWidth="1"
        />
        <rect x="138" y="233" width="24" height="14" rx="2"
          fill={N ? "#0f172a" : "#bfdbfe"} />
        <circle cx="169" cy="245" r="2.5" fill={N ? "#fbbf24" : "#f59e0b"} />

        {/* ── BUILDING SIGN ─────────────────────────────── */}
        <rect x="96" y="244" width="108" height="16" rx="3"
          fill={N ? "#1e293b" : "#e2e8f0"}
          stroke={N ? "#334155" : "#cbd5e1"} strokeWidth="1"
        />
        <text x="150" y="255" textAnchor="middle" fontSize="7.5"
          fontFamily="monospace" fontWeight="bold"
          fill={N ? "#60a5fa" : "#3b82f6"}
        >DEVOPSBOYS HQ</text>

        {/* ── POTTED PLANT ──────────────────────────────── */}
        <path d="M 238 258 L 244 272 L 264 272 L 270 258 Z"
          fill={N ? "#7c3aed" : "#a78bfa"} />
        <rect x="236" y="254" width="36" height="5" rx="2"
          fill={N ? "#5b21b6" : "#8b5cf6"} />
        <line x1="252" y1="254" x2="252" y2="228"
          stroke={N ? "#166534" : "#16a34a"} strokeWidth="2.5" />
        <ellipse cx="245" cy="240" rx="9" ry="5.5"
          fill={N ? "#166534" : "#16a34a"} transform="rotate(-35 245 240)" />
        <ellipse cx="259" cy="236" rx="9" ry="5.5"
          fill={N ? "#14532d" : "#15803d"} transform="rotate(35 259 236)" />
        <ellipse cx="252" cy="230" rx="7.5" ry="4.5"
          fill={N ? "#14532d" : "#22c55e"} />

        {/* ── RAIN (night — topmost layer) ──────────────── */}
        {N && RAIN.map((r, i) => (
          <line key={i}
            x1={r.x} y1={-20}
            x2={r.x - 5} y2={15}
            stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round"
            opacity="0.55"
            style={{ animation: "rain-fall 1.4s linear infinite", animationDelay: r.delay }}
          />
        ))}
      </svg>
    </div>
  )
}
