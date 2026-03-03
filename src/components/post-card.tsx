import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface PostCardProps {
  title: string
  description: string
  date: string
  tags: string[]
  slug: string
  author?: string
  readingTime?: number
}

// Tag → color accent mapping
const TAG_COLORS: Record<string, { bar: string; text: string; bg: string; border: string }> = {
  docker:      { bar: "from-cyan-500 to-blue-500",     text: "text-cyan-400",    bg: "bg-cyan-500/12",    border: "border-cyan-500/30"    },
  kubernetes:  { bar: "from-violet-500 to-indigo-500", text: "text-violet-400",  bg: "bg-violet-500/12",  border: "border-violet-500/30"  },
  k8s:         { bar: "from-violet-500 to-indigo-500", text: "text-violet-400",  bg: "bg-violet-500/12",  border: "border-violet-500/30"  },
  aws:         { bar: "from-orange-500 to-amber-500",  text: "text-orange-400",  bg: "bg-orange-500/12",  border: "border-orange-500/30"  },
  devops:      { bar: "from-blue-500 to-sky-500",      text: "text-blue-400",    bg: "bg-blue-500/12",    border: "border-blue-500/30"    },
  cicd:        { bar: "from-emerald-500 to-teal-500",  text: "text-emerald-400", bg: "bg-emerald-500/12", border: "border-emerald-500/30" },
  ai:          { bar: "from-pink-500 to-rose-500",     text: "text-pink-400",    bg: "bg-pink-500/12",    border: "border-pink-500/30"    },
  cloud:       { bar: "from-sky-500 to-cyan-500",      text: "text-sky-400",     bg: "bg-sky-500/12",     border: "border-sky-500/30"     },
  containers:  { bar: "from-cyan-500 to-blue-500",     text: "text-cyan-400",    bg: "bg-cyan-500/12",    border: "border-cyan-500/30"    },
  beginners:   { bar: "from-green-500 to-emerald-500", text: "text-green-400",   bg: "bg-green-500/12",   border: "border-green-500/30"   },
  gitops:      { bar: "from-rose-500 to-pink-500",     text: "text-rose-400",    bg: "bg-rose-500/12",    border: "border-rose-500/30"    },
  terraform:   { bar: "from-purple-500 to-violet-500", text: "text-purple-400",  bg: "bg-purple-500/12",  border: "border-purple-500/30"  },
  orchestration: { bar: "from-violet-500 to-indigo-500", text: "text-violet-400", bg: "bg-violet-500/12", border: "border-violet-500/30"  },
  eks:         { bar: "from-orange-500 to-amber-500",  text: "text-orange-400",  bg: "bg-orange-500/12",  border: "border-orange-500/30"  },
}

const DEFAULT = { bar: "from-blue-500 to-violet-500", text: "text-blue-400", bg: "bg-blue-500/12", border: "border-blue-500/30" }

function getColor(tags: string[]) {
  for (const tag of tags) {
    const c = TAG_COLORS[tag.toLowerCase()]
    if (c) return c
  }
  return DEFAULT
}

export function PostCard({ title, description, date, tags, slug, author, readingTime }: PostCardProps) {
  const color = getColor(tags)

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/20 hover:border-border transition-all duration-300">

      {/* Colored top accent bar */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${color.bar} shrink-0`} />

      {/* Subtle hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-b from-primary/[0.03] to-transparent" />

      <div className="relative flex flex-col flex-1 p-5">

        {/* Tags row */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag, i) => (
              <Link key={tag} href={`/tags/${tag}`} className="relative z-10">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all duration-200 ${
                  i === 0
                    ? `${color.text} ${color.bg} ${color.border}`
                    : "text-muted-foreground bg-muted/40 border-border/60 hover:text-foreground hover:border-border"
                }`}>
                  {tag}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-base font-bold mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${slug}`}>
            <span className="absolute inset-0 z-0 rounded-2xl" aria-hidden="true" />
            {title}
          </Link>
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3.5 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            {/* Author avatar */}
            {author && (
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${color.bg} ${color.text}`}>
                {author[0].toUpperCase()}
              </div>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(date)}
            </span>
            {readingTime && (
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${color.bg} ${color.text}`}>
                <Clock className="h-2.5 w-2.5" />
                {readingTime} min
              </span>
            )}
          </div>
          <span className={`flex items-center gap-1 text-xs font-bold ${color.text} group-hover:gap-2 transition-all relative z-10`}>
            Read <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </article>
  )
}
