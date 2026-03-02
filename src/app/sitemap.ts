import { posts } from "@/lib/content"
import type { MetadataRoute } from "next"

const BASE_URL = "https://devopsboys.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedPosts = posts.filter((p) => p.published)

  const allTags = Array.from(new Set(publishedPosts.flatMap((p) => p.tags)))

  const postRoutes = publishedPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slugAsParams}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const tagRoutes = allTags.map((tag) => ({
    url: `${BASE_URL}/tags/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/tags`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    ...postRoutes,
    ...tagRoutes,
  ]
}
