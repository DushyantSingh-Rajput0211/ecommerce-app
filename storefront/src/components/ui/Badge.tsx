import { ReactNode } from "react"

type Tone = "accent" | "neutral" | "success" | "warning"

const tones: Record<Tone, string> = {
  accent: "bg-accent/15 text-accent border-accent/30",
  neutral: "bg-white/5 text-muted border-border",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
}

export default function Badge({
  children,
  tone = "accent",
  className = "",
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
