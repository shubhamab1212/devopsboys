import { posts } from "@/lib/content"
import { MDXContent } from "@/components/mdx-components"
import { TableOfContents } from "@/components/toc"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import { ReadingProgress } from "@/components/reading-progress"
import { ShareButtons } from "@/components/share-buttons"
import { BackToTop } from "@/components/back-to-top"
import { NewsletterCTA } from "@/components/newsletter-cta"
import { GiscusComments } from "@/components/giscus-comments"
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

function getRelatedPosts(currentPost: { slugAsParams: string; tags: string[] }, count = 3) {
  return posts
    .filter((p) => p.published && p.slugAsParams !== currentPost.slugAsParams)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => currentPost.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.post)
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
  const relatedPosts = getRelatedPosts(post)
  const postUrl = `${BASE_URL}/blog/${post.slugAsParams}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author,
      url: `${BASE_URL}/about`,
    },
    datePublished: post.date,
    dateModified: post.date,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    publisher: {
      "@type": "Organization",
      name: "DevOpsBoys",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.ico` },
    },
    keywords: post.tags.join(", "),
    image: `${BASE_URL}/blog/${post.slugAsParams}/opengraph-image`,
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  }

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Reading progress bar */}
      <ReadingProgress />

      {/* Back to top floating button */}
      <BackToTop />

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

            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-border">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
              <ShareButtons title={post.title} url={postUrl} />
            </div>

            <MDXContent code={post.body} />

            {/* Bottom share + back */}
            <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <Button asChild variant="outline">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to all articles
                </Link>
              </Button>
              <ShareButtons title={post.title} url={postUrl} />
            </div>

            {/* Newsletter CTA */}
            <div className="mt-10">
              <NewsletterCTA />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-6">Related Articles</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((related) => (
                    <PostCard
                      key={related.slug}
                      title={related.title}
                      description={related.description}
                      date={related.date}
                      tags={related.tags}
                      slug={related.slugAsParams}
                      author={related.author}
                      readingTime={getReadingTime(related.body)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <GiscusComments />
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
