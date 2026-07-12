"use client"

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react"

type Variant = "gradient" | "outline" | "ghost"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const base =
  "inline-flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-medium " +
  "transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm"

const sizes: Record<Size, string> = {
  sm: "text-[10px] px-4 py-2",
  md: "text-xs px-6 py-3",
  lg: "text-xs px-8 py-4",
}

const variants: Record<Variant, string> = {
  gradient:
    "text-white bg-[image:var(--grad-primary)] bg-[length:200%_200%] hover:bg-[position:100%_50%] " +
    "shadow-[0_8px_30px_-8px_rgba(124,58,237,0.6)] hover:shadow-[0_10px_40px_-6px_rgba(124,58,237,0.8)]",
  outline:
    "border border-border text-fg hover:border-accent hover:text-white glow-hover",
  ghost: "text-muted hover:text-fg",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "gradient", size = "md", className = "", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
