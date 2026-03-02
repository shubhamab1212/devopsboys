import Link from "next/link"
import { posts } from "@/lib/content"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getReadingTime, formatDate } from "@/lib/utils"
import {
  ArrowRight,
  Terminal,
  Cloud,
  Bot,
  GitBranch,
  Server,
  Zap,
} from "lucide-react"

const publishedPosts = posts
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const featuredPost = publishedPosts[0]
const recentPosts = publishedPosts.slice(1, 5)

const topics = [
  { icon: Terminal, label: "DevOps", color: "text-blue-500", href: "/tags/devops" },
  { icon: Cloud, label: "Cloud / AWS", color: "text-sky-500", href: "/tags/aws" },
  { icon: Server, label: "Docker", color: "text-cyan-500", href: "/tags/docker" },
  { icon: GitBranch, label: "Kubernetes", color: "text-violet-500", href: "/tags/kubernetes" },
  { icon: Bot, label: "AI & ML", color: "text-emerald-500", href: "/tags/ai" },
  { icon: Zap, label: "CI/CD", color: "text-orange-500", href: "/tags/cicd" },
]

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4">
      {/* Hero Section */}
      <section className="py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          DevOps, Cloud, AI &amp; ML ke practical tutorials
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Learn{" "}
          <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
            DevOps &amp; Cloud
          </span>
          <br />
          the right way
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Real-world guides on Docker, Kubernetes, AWS, CI/CD, AI/ML aur bahut kuch.
          Beginners se leke experienced engineers tak — sab ke liye.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href="/blog">
              Read Blogs <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/tags">Browse Topics</Link>
          </Button>
        </div>
      </section>

      {/* Topics */}
      <section className="py-10 border-y border-border/50">
        <div className="flex flex-wrap justify-center gap-4">
          {topics.map(({ icon: Icon, label, color, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:border-primary/50 hover:bg-accent transition-all text-sm font-medium"
            >
              <Icon className={`h-4 w-4 ${color}`} />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Latest Post</h2>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <Link href={`/blog/${featuredPost.slugAsParams}`} className="group block">
            <article className="relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 p-8 md:p-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

              <div className="flex flex-wrap gap-2 mb-4 relative">
                {featuredPost.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors relative leading-snug">
                {featuredPost.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-6 relative max-w-2xl">
                {featuredPost.description}
              </p>

              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {featuredPost.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{featuredPost.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(featuredPost.date)} &middot;{" "}
                      {getReadingTime(featuredPost.body)} min read
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                  Read post <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentPosts.map((post) => (
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
        </section>
      )}
    </div>
  )
}
