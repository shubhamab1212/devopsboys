"use client"

import { useState } from "react"
import { Mail, Sparkles, CheckCircle2 } from "lucide-react"

export function NewsletterCTA() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
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
            <span>You&apos;re subscribed! Welcome aboard.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
