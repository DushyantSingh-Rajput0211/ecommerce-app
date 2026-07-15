"use client"

import { Check } from "lucide-react"

export default function CheckoutSteps({
  steps,
  current,
  onStep,
}: {
  steps: string[]
  current: number
  onStep?: (i: number) => void
}) {
  return (
    <ol className="flex items-center gap-2 mb-10">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        const clickable = done && onStep
        return (
          <li key={label} className="flex items-center gap-2 flex-1 last:flex-none">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStep(i)}
              className={`flex items-center gap-2 ${clickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-colors ${
                  done
                    ? "bg-accent border-accent text-white"
                    : active
                    ? "border-accent text-accent"
                    : "border-border text-muted"
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span
                className={`hidden sm:block text-[10px] tracking-widest uppercase ${
                  active ? "text-fg" : "text-muted"
                }`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                className={`flex-1 h-px min-w-4 ${done ? "bg-accent" : "bg-border"}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
