"use client"

import { useEffect, useRef } from "react"

const CARBON_ID = process.env.NEXT_PUBLIC_CARBON_ADS_ID

// Renders a Carbon Ad unit.
// Set NEXT_PUBLIC_CARBON_ADS_ID in env vars after approval at buysellads.com/carbon
// Until then, this component renders nothing.
export function CarbonAds() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!CARBON_ID || !ref.current) return
    ref.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_ID}&placement=devopsboyscom`
    script.id = "_carbonads_js"
    script.async = true
    ref.current.appendChild(script)
  }, [])

  if (!CARBON_ID) return null

  return (
    <div
      ref={ref}
      className="carbon-wrap rounded-xl border border-border bg-card/60 overflow-hidden text-xs"
    />
  )
}
