import { ImageResponse } from "next/og"
import { posts } from "@/lib/content"

export const runtime = "edge"
export const alt = "DevOpsBoys Blog Post"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params
  const post = posts.find((p) => p.slugAsParams === slug && p.published)

  const title = post?.title ?? "DevOpsBoys"
  const description = post?.description ?? "Practical DevOps, Cloud, and AI/ML guides."
  const tags = post?.tags?.slice(0, 3) ?? []

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0f 0%, #0f0a1e 50%, #0a0f1e 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top grid dots effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>D</span>
          </div>
          <span style={{ color: "#94a3b8", fontSize: 18, fontWeight: 600 }}>DevOpsBoys</span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", flex: 1, justifyContent: "center", paddingTop: 40 }}>
          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: "10px" }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "rgba(37,99,235,0.15)",
                    border: "1px solid rgba(37,99,235,0.4)",
                    color: "#60a5fa",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "lowercase",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 50 ? 44 : 54,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 20,
              color: "#94a3b8",
              lineHeight: 1.5,
              maxWidth: 800,
            }}
          >
            {description.length > 120 ? description.slice(0, 120) + "…" : description}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ color: "#475569", fontSize: 16 }}>devopsboys.com</span>
          <span
            style={{
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Read Article →
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
