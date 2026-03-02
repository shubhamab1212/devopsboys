import { posts } from "@/lib/content"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tags",
  description: "DevOpsBoys ke saare tags browse karo.",
}

export default function TagsPage() {
  const publishedPosts = posts.filter((p) => p.published)
  const tagCounts: Record<string, number> = {}

  publishedPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-3">All Tags</h1>
        <p className="text-muted-foreground text-lg">
          {sortedTags.length} tags across {publishedPosts.length} articles
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {sortedTags.map(([tag, count]) => (
          <Link key={tag} href={`/tags/${tag}`}>
            <Badge
              variant="secondary"
              className="text-sm py-1.5 px-4 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer border border-border"
            >
              {tag}
              <span className="ml-2 text-xs opacity-60">{count}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
