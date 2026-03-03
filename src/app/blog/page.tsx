import { posts } from "@/lib/content"
import { PostCard } from "@/components/post-card"
import { getReadingTime } from "@/lib/utils"
import { BookOpen, Tag, Rss } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "All articles on DevOps, Cloud, Docker, Kubernetes, AWS, CI/CD, AI and ML.",
}

export default function BlogPage() {
  const publishedPosts = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const allTags = Array.from(new Set(publishedPosts.flatMap((p) => p.tags))).sort()
  const totalMins = publishedPosts.reduce((s, p) => s + getReadingTime(p.body), 0)

  return (
    <div className="min-h-screen">

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-gradient-to-bl from-violet-600/12 to-blue-600/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-64 rounded-full bg-gradient-to-tr from-cyan-600/10 to-emerald-600/8 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-gradient-to-r from-blue-500/6 to-violet-500/6 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 py-16 relative">
          {/* Label */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">All Articles</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            The DevOps{" "}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Knowledge Base
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            In-depth guides on Docker, Kubernetes, AWS, CI/CD, AI/ML, and modern infrastructure —
            written by engineers, for engineers.
          </p>

          {/* Stat badges */}
          <div className="flex flex-wrap gap-3">
            {[
              { dot: "bg-blue-400",    label: `${publishedPosts.length} Articles`         },
              { dot: "bg-violet-400",  label: `${allTags.length} Topics`                 },
              { dot: "bg-emerald-400", label: `${totalMins}+ min of content`             },
              { dot: "bg-yellow-400",  label: "100% Free"                                },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
                <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}

            {/* RSS link */}
            <Link
              href="/rss.xml"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-orange-500/30 text-sm text-orange-400 hover:bg-orange-500/10 transition-colors"
            >
              <Rss className="h-3.5 w-3.5" />
              RSS Feed
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div className="container mx-auto max-w-5xl px-4 py-12">

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Tag className="h-3.5 w-3.5" /> Filter by topic
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
              >
                All ({publishedPosts.length})
              </Link>
              {allTags.map((tag) => {
                const count = publishedPosts.filter((p) => p.tags.includes(tag)).length
                return (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="px-4 py-1.5 rounded-full text-sm font-medium border border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                  >
                    {tag}
                    <span className="ml-1.5 text-[11px] text-muted-foreground/60">({count})</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Posts grid with staggered fade-up */}
        {publishedPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedPosts.map((post, idx) => (
              <div
                key={post.slug}
                className="animate-fade-up opacity-0"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                {idx === 0 && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-green-400 uppercase tracking-widest">Latest</span>
                  </div>
                )}
                <PostCard
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  tags={post.tags}
                  slug={post.slugAsParams}
                  author={post.author}
                  readingTime={getReadingTime(post.body)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
