import * as runtime from "react/jsx-runtime"
import { CopyButton } from "./copy-button"

function useMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

const components = {
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    const codeEl = (children as React.ReactElement<{ children?: string }>)
    const text = codeEl?.props?.children ?? ""
    return (
      <div className="relative group">
        <pre {...props}>{children}</pre>
        <CopyButton text={String(text)} />
      </div>
    )
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
