import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limiter (resets on cold start — good enough for a blog)
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3        // max requests
const WINDOW_MS = 60_000    // per 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT) return true

  entry.count++
  return false
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: Request) {
  try {
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await req.json()
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 })
    }

    // Add contact to Resend audience (if RESEND_AUDIENCE_ID set)
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID,
        unsubscribed: false,
      })
    }

    // Send welcome email
    await resend.emails.send({
      from: "DevOpsBoys <hello@devopsboys.com>",
      to: email,
      subject: "Welcome to DevOpsBoys!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #60a5fa; margin-bottom: 8px;">Welcome aboard! 🚀</h1>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
            You're now subscribed to <strong style="color: #fff;">DevOpsBoys</strong> — practical guides on DevOps, Kubernetes, AWS, and AI/ML.
          </p>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
            We'll send you new articles as they're published. No spam, ever.
          </p>
          <a href="https://devopsboys.com/blog" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Browse Articles →
          </a>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 32px 0;" />
          <p style="color: #475569; font-size: 12px;">
            You received this email because you subscribed at devopsboys.com.<br />
            <a href="https://devopsboys.com" style="color: #60a5fa;">devopsboys.com</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscribe error:", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
