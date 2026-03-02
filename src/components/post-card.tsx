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

export function PostCard({
  title,
  description,
  date,
  tags,
  slug,
  author = "DevOpsBoys",
  readingTime,
}: PostCardProps) {
  return (
    <article className="group relative flex flex-col bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              <Link href={`/tags/${tag}`}>{tag}</Link>
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h2 className="text-xl font-bold mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
        <Link href={`/blog/${slug}`} className="stretched-link">
          {title}
        </Link>
      </h2>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
        {description}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/60">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(date)}
          </span>
          {readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min read
            </span>
          )}
        </div>
        <Link
          href={`/blog/${slug}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:gap-2 transition-all"
        >
          Read more <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  )
}
