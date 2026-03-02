import Link from "next/link"
import { posts } from "@/lib/content"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getReadingTime, formatDate } from "@/lib/utils"
import {
  ArrowRight, Terminal, Cloud, Bot, GitBranch, Server, Zap, BookOpen,
} from "lucide-react"

const publishedPosts = posts
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const featuredPost = publishedPosts[0]
const recentPosts = publishedPosts.slice(1, 4)
const allTags = Array.from(new Set(publishedPosts.flatMap((p) => p.tags)))

const topics = [
  { icon: Terminal,  label: "DevOps",       color: "text-blue-400",    href: "/tags/devops" },
  { icon: Cloud,     label: "Cloud / AWS",  color: "text-sky-400",     href: "/tags/aws" },
  { icon: Server,    label: "Docker",       color: "text-cyan-400",    href: "/tags/docker" },
  { icon: GitBranch, label: "Kubernetes",   color: "text-violet-400",  href: "/tags/kubernetes" },
  { icon: Bot,       label: "AI & ML",      color: "text-emerald-400", href: "/tags/ai" },
  { icon: Zap,       label: "CI/CD",        color: "text-orange-400",  href: "/tags/cicd" },
]

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center">

        {/* Dot grid background */}
        <div className="absolute inset-0 bg-dot-grid pointer-events-none" />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-float animate-pulse-glow absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-600/25 to-violet-600/20 blur-[80px]" />
          <div className="animate-float-delayed animate-pulse-glow absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-cyan-600/20 to-blue-600/20 blur-[90px]" />
          <div className="animate-float-slow animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-violet-600/15 to-indigo-600/15 blur-[70px]" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 container mx-auto max-w-5xl px-4 text-center py-24">

          {/* Badge */}
          <div className="animate-fade-up opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Practical DevOps &amp; Cloud Knowledge
          </div>

          {/* Title */}
          <h1 className="animate-fade-up delay-100 opacity-0 text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Master{" "}
            <span className="text-shimmer">DevOps &amp; Cloud</span>
            <br className="hidden sm:block" />
            {" "}Engineering
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-200 opacity-0 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            In-depth guides on Docker, Kubernetes, AWS, CI/CD pipelines, AI/ML deployments,
            and modern infrastructure — written by engineers, for engineers.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 opacity-0 flex flex-wrap items-center justify-center gap-4 mb-14">
            <Button asChild size="lg" className="gap-2 px-7 h-12 text-base shadow-lg shadow-primary/25">
              <Link href="/blog">
                <BookOpen className="h-4 w-4" /> Read Articles
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 px-7 h-12 text-base">
              <Link href="/tags">
                Browse Topics <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up delay-400 opacity-0 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-foreground">{publishedPosts.length}</p>
              <p className="text-xs uppercase tracking-wide mt-0.5">Articles</p>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-foreground">{allTags.length}+</p>
              <p className="text-xs uppercase tracking-wide mt-0.5">Topics</p>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-foreground">Free</p>
              <p className="text-xs uppercase tracking-wide mt-0.5">Always</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOPICS STRIP ─────────────────────────────────── */}
      <section className="py-10 border-y border-border/50 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {topics.map(({ icon: Icon, label, color, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary/50 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 transition-all text-sm font-medium"
              >
                <Icon className={`h-4 w-4 ${color} group-hover:scale-110 transition-transform`} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED POST ────────────────────────────────── */}
      {featuredPost && (
        <section className="relative py-20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-violet-600/8 to-transparent blur-[70px] pointer-events-none" />

          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Latest Article</p>
                <h2 className="text-3xl font-bold">Featured Post</h2>
              </div>
              <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                All articles <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <Link href={`/blog/${featuredPost.slugAsParams}`} className="group block">
              <article className="glow-card gradient-top relative overflow-hidden p-8 md:p-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />

                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-5">
                    {featuredPost.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs border border-border">
                        {tag}
                      </Badge>
                    ))}
                    <Badge className="text-xs ml-auto bg-primary/15 text-primary border border-primary/30">
                      Latest
                    </Badge>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug max-w-3xl">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                    {featuredPost.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white shadow">
                        {featuredPost.author[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{featuredPost.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(featuredPost.date)} &middot; {getReadingTime(featuredPost.body)} min read
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                      Read article <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      {/* ── RECENT POSTS ─────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="relative pb-24">
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-cyan-600/8 to-transparent blur-[60px] pointer-events-none" />

          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Keep Reading</p>
                <h2 className="text-3xl font-bold">Recent Articles</h2>
              </div>
              <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                View all <ArrowRight className="h-3.5 w-3.5" />
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

            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/blog">View All Articles <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
