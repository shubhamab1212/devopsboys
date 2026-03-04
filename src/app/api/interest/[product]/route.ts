import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

const ALLOWED = ["interview-prep-bundle", "cheatsheets-pack", "github-actions-templates"]

// POST — public: increment interest count
export async function POST(_req: Request, { params }: { params: Promise<{ product: string }> }) {
  const { product } = await params
  if (!ALLOWED.includes(product)) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const redis = getRedis()
  if (!redis) return NextResponse.json({ ok: true })

  await redis.incr(`interest:${product}`)
  return NextResponse.json({ ok: true })
}

// GET — admin only: ?key=YOUR_ADMIN_SECRET returns count
export async function GET(req: Request, { params }: { params: Promise<{ product: string }> }) {
  const { product } = await params
  const { searchParams } = new URL(req.url)
  const key = searchParams.get("key")
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || key !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const redis = getRedis()
  if (!redis) return NextResponse.json({ product, count: 0 })

  const count = (await redis.get<number>(`interest:${product}`)) ?? 0
  return NextResponse.json({ product, count })
}
