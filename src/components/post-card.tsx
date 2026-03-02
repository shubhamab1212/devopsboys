import Link from "next/link"
import { Badge } from "./ui/badge"
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

export function PostCard({ title, description, date, tags, slug, readingTime }: PostCardProps) {
  return (
    <article className="glow-card gradient-top group relative flex flex-col p-6 hover:-translate-y-1 transition-all duration-300">

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-medium border border-border hover:border-primary/50 transition-colors relative z-10">
              <Link href={`/tags/${tag}`}>{tag}</Link>
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h2 className="text-lg font-bold mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
        <Link href={`/blog/${slug}`}>
          <span className="absolute inset-0 z-0 rounded-xl" aria-hidden="true" />
          {title}
        </Link>
      </h2>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60 mt-auto">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(date)}
          </span>
          {readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all relative z-10">
          Read <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </article>
  )
}
