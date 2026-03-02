import { posts } from "@/lib/content"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { getReadingTime } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = new Set(
    posts.filter((p) => p.published).flatMap((p) => p.tags)
  )
  return Array.from(tags).map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `${tag} - Posts`,
    description: `All articles tagged with "${tag}" on DevOpsBoys.`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params

  const tagPosts = posts
    .filter((p) => p.published && p.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (tagPosts.length === 0) notFound()

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2 text-muted-foreground hover:text-foreground">
        <Link href="/tags">
          <ArrowLeft className="h-4 w-4 mr-1" />
          All Tags
        </Link>
      </Button>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-extrabold">#{tag}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {tagPosts.length} article{tagPosts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tagPosts.map((post) => (
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
    </div>
  )
}
