import * as runtime from "react/jsx-runtime"
import { CopyButton } from "./copy-button"
import React from "react"

function useMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

// Extract plain text from React children recursively
function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(extractText).join("")
  if (React.isValidElement(children)) {
    const el = children as React.ReactElement<{ children?: React.ReactNode }>
    return extractText(el.props.children)
  }
  return ""
}

// Detect callout type from blockquote first-child text
function detectCallout(children: React.ReactNode): { type: string; icon: string } | null {
  const text = extractText(children).trimStart().toUpperCase()
  if (text.startsWith("[!NOTE]") || text.startsWith("NOTE:"))     return { type: "info",    icon: "ℹ️" }
  if (text.startsWith("[!TIP]") || text.startsWith("TIP:"))       return { type: "tip",     icon: "💡" }
  if (text.startsWith("[!WARNING]") || text.startsWith("WARNING:")) return { type: "warning", icon: "⚠️" }
  if (text.startsWith("[!CAUTION]") || text.startsWith("DANGER:")) return { type: "danger",  icon: "🚨" }
  if (text.startsWith("[!IMPORTANT]"))                              return { type: "warning", icon: "📌" }
  return null
}

// Strip the callout prefix from paragraph children
function stripCalloutPrefix(children: React.ReactNode): React.ReactNode {
  if (!React.isValidElement(children)) return children
  const el = children as React.ReactElement<{ children?: React.ReactNode }>
  const text = extractText(el.props.children)
  const stripped = text
    .replace(/^\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]\s*/i, "")
    .replace(/^(NOTE|TIP|WARNING|DANGER):\s*/i, "")
  if (typeof el.props.children === "string") {
    return React.cloneElement(el, {}, stripped)
  }
  return children
}

const components = {
  // Premium code block with gradient accent + language badge
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    const codeEl = children as React.ReactElement<{
      children?: string
      "data-language"?: string
    }>
    const text = codeEl?.props?.children ?? ""
    const language = (props as Record<string, unknown>)["data-language"] as string | undefined

    return (
      <div className="code-block-wrap">
        {language && (
          <div className="code-lang-bar">
            <span className="code-lang-name">{language}</span>
          </div>
        )}
        <div className="relative">
          <pre {...props}>{children}</pre>
          <CopyButton text={String(text)} />
        </div>
      </div>
    )
  },

  // Wrap tables for horizontal scroll
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="table-wrap">
      <table {...props}>{children}</table>
    </div>
  ),

  // Callout-aware blockquote
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => {
    const callout = detectCallout(children)
    if (callout) {
      const childArray = React.Children.toArray(children)
      const [first, ...rest] = childArray
      const strippedFirst = React.isValidElement(first)
        ? React.cloneElement(
            first as React.ReactElement<{ children?: React.ReactNode }>,
            {},
            stripCalloutPrefix((first as React.ReactElement<{ children?: React.ReactNode }>).props.children)
          )
        : first
      return (
        <div className={`callout callout-${callout.type}`}>
          <span className="callout-icon">{callout.icon}</span>
          <div className="callout-body">
            {strippedFirst}
            {rest}
          </div>
        </div>
      )
    }
    return <blockquote {...props}>{children}</blockquote>
  },
}

interface MdxProps {
  code: string
}

export function MDXContent({ code }: MdxProps) {
  const Component = useMDXComponent(code)
  return (
    <div className="prose max-w-none">
      <Component components={components} />
    </div>
  )
}
