import { ElementType, ReactNode } from "react"

/**
 * Renders text with the animated neon gradient clip. Polymorphic via `as`
 * so it can be an h1, span, etc.
 */
export default function GradientText({
  as: Tag = "span",
  children,
  className = "",
}: {
  as?: ElementType
  children: ReactNode
  className?: string
}) {
  return <Tag className={`text-gradient ${className}`}>{children}</Tag>
}
