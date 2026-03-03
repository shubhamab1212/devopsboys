"use client"

import { useState } from "react"
import { Mail, Sparkles, CheckCircle2, Loader2 } from "lucide-react"

export function NewsletterCTA() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-10">
      {/* Background orb */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-600/10 to-violet-600/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-primary">Newsletter</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-2">
          Stay ahead of the curve
        </h3>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Get the latest DevOps, Kubernetes, AWS, and AI/ML guides delivered straight to your inbox. No spam — just practical engineering content.
        </p>

        {submitted ? (
          <div className="flex items-center gap-2 text-green-500 font-medium">
            <CheckCircle2 className="h-5 w-5" />
            <span>You&apos;re subscribed! Check your inbox for a welcome email.</span>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Subscribe
              </button>
            </form>
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
