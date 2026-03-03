import { posts } from "@/lib/content"

const BASE_URL = "https://devopsboys.com"

export async function GET() {
  const publishedPosts = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const items = publishedPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${BASE_URL}/blog/${post.slugAsParams}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slugAsParams}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.tags.join(", ")}</category>
    </item>`
    )
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DevOpsBoys</title>
    <link>${BASE_URL}</link>
    <description>Practical guides on DevOps, Cloud, Docker, Kubernetes, AWS, and AI/ML.</description>
    <language>en-us</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
