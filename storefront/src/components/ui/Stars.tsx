"use client"

import { Star } from "lucide-react"
import { useState } from "react"

/** Read-only star rating (supports halves). */
export function Stars({
  rating,
  size = 14,
  className = "",
}: {
  rating: number
  size?: number
  className?: string
}) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-border" fill="currentColor" />
            <span
              className="absolute inset-0 overflow-hidden text-amber-400"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} fill="currentColor" />
            </span>
          </span>
        )
      })}
    </div>
  )
}

/** Interactive star picker for the review form. */
export function StarInput({
  value,
  onChange,
  size = 22,
}: {
  value: number
  onChange: (v: number) => void
  size?: number
}) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={n <= shown ? "text-amber-400" : "text-border"}
            fill="currentColor"
          />
        </button>
      ))}
    </div>
  )
}
