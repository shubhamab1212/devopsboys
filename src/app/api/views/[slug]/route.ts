import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

// Returns null if env vars not set (graceful degradation)
function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  return new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const redis = getRedis()
  if (!redis) return NextResponse.json({ views: null })

  const views = await redis.get<number>(`views:${slug}`) ?? 0
  return NextResponse.json({ views })
}

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const redis = getRedis()
  if (!redis) return NextResponse.json({ views: null })

  const views = await redis.incr(`views:${slug}`)
  return NextResponse.json({ views })
}
