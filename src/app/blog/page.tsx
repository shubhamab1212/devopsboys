import { posts } from "@/lib/content"
import { PostCard } from "@/components/post-card"
import { getReadingTime } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "DevOps, Cloud, AI aur ML ke saare articles aur tutorials.",
}

export default function BlogPage() {
  const publishedPosts = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const allTags = Array.from(
    new Set(publishedPosts.flatMap((p) => p.tags))
  ).sort()

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-3">All Posts</h1>
        <p className="text-muted-foreground text-lg">
          {publishedPosts.length} articles on DevOps, Cloud, AI &amp; ML
        </p>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <a
            href="/blog"
            className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            All
          </a>
          {allTags.map((tag) => (
            <a
              key={tag}
              href={`/tags/${tag}`}
              className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border"
            >
              {tag}
            </a>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {publishedPosts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {publishedPosts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              tags={post.tags}
              slug={post.slugAsParams}
              author={post.author}
              readingTime={getReadingTime(post.body)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">Koi posts nahi mile.</p>
        </div>
      )}
    </div>
  )
}
