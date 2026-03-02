import { posts } from "@/lib/content"
import { MDXContent } from "@/components/mdx-components"
import { TableOfContents } from "@/components/toc"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, getReadingTime } from "@/lib/utils"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Script from "next/script"

const BASE_URL = "https://devopsboys.com"

interface PageProps {
  params: Promise<{ slug: string }>
}

function getPostBySlug(slug: string) {
  return posts.find((post) => post.slugAsParams === slug && post.published)
}

export async function generateStaticParams() {
  return posts.filter((p) => p.published).map((post) => ({ slug: post.slugAsParams }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${BASE_URL}/blog/${post.slugAsParams}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      siteName: "DevOpsBoys",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slugAsParams}`,
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const readingTime = getReadingTime(post.body)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    dateModified: post.date,
    url: `${BASE_URL}/blog/${post.slugAsParams}`,
    publisher: {
      "@type": "Organization",
      name: "DevOpsBoys",
      url: BASE_URL,
    },
    keywords: post.tags.join(", "),
  }

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-1" />
            All Articles
          </Link>
        </Button>

        <div className="flex gap-12 items-start">
          {/* Main Content */}
          <article className="flex-1 min-w-0">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs border border-border">
                    <Link href={`/tags/${tag}`}>{tag}</Link>
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-8 mb-8 border-b border-border">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} min read
              </span>
            </div>

            <MDXContent code={post.body} />

            <div className="mt-16 pt-8 border-t border-border">
              <Button asChild variant="outline">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to all articles
                </Link>
              </Button>
            </div>
          </article>

          {/* TOC Sidebar */}
          {post.toc && post.toc.length > 0 && (
            <aside className="hidden xl:block w-64 shrink-0 sticky top-24">
              <div className="rounded-xl border border-border bg-card p-5">
                <TableOfContents toc={post.toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  )
}
