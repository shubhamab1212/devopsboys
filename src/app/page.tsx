import Link from "next/link"
import { posts } from "@/lib/content"
import { PostCard } from "@/components/post-card"
import { NewsletterCTA } from "@/components/newsletter-cta"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getReadingTime, formatDate } from "@/lib/utils"
import {
  ArrowRight, Terminal, Cloud, Bot, GitBranch, Server, Zap, BookOpen, Map, FileCode2, Wrench,
} from "lucide-react"

const publishedPosts = posts
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const featuredPost = publishedPosts[0]
const recentPosts = publishedPosts.slice(1, 4)
const allTags = Array.from(new Set(publishedPosts.flatMap((p) => p.tags)))

const topics = [
  { icon: Terminal,  label: "DevOps",          iconColor: "text-blue-400",    hoverBg: "hover:bg-blue-500/15",    hoverBorder: "hover:border-blue-500/50",    hoverText: "hover:text-blue-300",    glow: "topic-glow-blue",    href: "/tags/devops",      delay: 0    },
  { icon: Cloud,     label: "Cloud / AWS",     iconColor: "text-sky-400",     hoverBg: "hover:bg-sky-500/15",     hoverBorder: "hover:border-sky-500/50",     hoverText: "hover:text-sky-300",     glow: "topic-glow-sky",     href: "/tags/aws",         delay: 200  },
  { icon: Server,    label: "Docker",          iconColor: "text-cyan-400",    hoverBg: "hover:bg-cyan-500/15",    hoverBorder: "hover:border-cyan-500/50",    hoverText: "hover:text-cyan-300",    glow: "topic-glow-cyan",    href: "/tags/docker",      delay: 400  },
  { icon: GitBranch, label: "Kubernetes",      iconColor: "text-violet-400",  hoverBg: "hover:bg-violet-500/15",  hoverBorder: "hover:border-violet-500/50",  hoverText: "hover:text-violet-300",  glow: "topic-glow-violet",  href: "/tags/kubernetes",  delay: 600  },
  { icon: Bot,       label: "AI & ML",         iconColor: "text-emerald-400", hoverBg: "hover:bg-emerald-500/15", hoverBorder: "hover:border-emerald-500/50", hoverText: "hover:text-emerald-300", glow: "topic-glow-emerald", href: "/tags/ai",          delay: 800  },
  { icon: Zap,       label: "CI/CD",           iconColor: "text-orange-400",  hoverBg: "hover:bg-orange-500/15",  hoverBorder: "hover:border-orange-500/50",  hoverText: "hover:text-orange-300",  glow: "topic-glow-orange",  href: "/tags/cicd",        delay: 1000 },
  { icon: BookOpen,  label: "Interview Prep",  iconColor: "text-pink-400",    hoverBg: "hover:bg-pink-500/15",    hoverBorder: "hover:border-pink-500/50",    hoverText: "hover:text-pink-300",    glow: "topic-glow-blue",    href: "/interview-prep",   delay: 1200 },
  { icon: FileCode2, label: "Cheatsheets",     iconColor: "text-cyan-400",    hoverBg: "hover:bg-cyan-500/15",    hoverBorder: "hover:border-cyan-500/50",    hoverText: "hover:text-cyan-300",    glow: "topic-glow-cyan",    href: "/cheatsheets",      delay: 1400 },
  { icon: Map,       label: "Roadmap",         iconColor: "text-violet-400",  hoverBg: "hover:bg-violet-500/15",  hoverBorder: "hover:border-violet-500/50",  hoverText: "hover:text-violet-300",  glow: "topic-glow-violet",  href: "/roadmap",          delay: 1600 },
  { icon: Wrench,    label: "Tools",           iconColor: "text-emerald-400", hoverBg: "hover:bg-emerald-500/15", hoverBorder: "hover:border-emerald-500/50", hoverText: "hover:text-emerald-300", glow: "topic-glow-emerald", href: "/tools",            delay: 1800 },
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
      <section className="py-12 border-y border-border/50 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            Explore by Topic
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {topics.map(({ icon: Icon, label, iconColor, hoverBg, hoverBorder, hoverText, glow, href, delay }) => (
              <Link
                key={label}
                href={href}
                style={{ animationDelay: `${delay}ms` }}
                className={`animate-bob group flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground transition-all duration-300 hover:-translate-y-2 ${hoverBg} ${hoverBorder} ${hoverText} ${glow}`}
              >
                <Icon className={`h-4 w-4 ${iconColor} transition-all duration-300 group-hover:scale-125`} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED POST ────────────────────────────────── */}
      {featuredPost && (
        <section className="relative py-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-violet-500/15 to-transparent blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-[60px] pointer-events-none" />

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
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-cyan-500/15 to-transparent blur-[70px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[280px] h-[280px] rounded-full bg-gradient-to-bl from-emerald-500/10 to-transparent blur-[55px] pointer-events-none" />

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

      {/* ── NEWSLETTER ───────────────────────────────────── */}
      <section className="pb-24">
        <div className="container mx-auto max-w-5xl px-4">
          <NewsletterCTA />
        </div>
      </section>
    </div>
  )
}
