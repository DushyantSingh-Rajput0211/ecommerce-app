"use client"

import { useEffect } from "react"
import Link from "next/link"
import GradientText from "@/components/ui/GradientText"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface for debugging / future error reporting.
    console.error(error)
  }, [error])

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p
          className="font-display font-semibold leading-none text-gradient"
          style={{ fontSize: "clamp(4rem, 16vw, 9rem)" }}
        >
          Oops
        </p>
        <h1 className="font-display text-2xl font-semibold mt-4 mb-3">
          Something <GradientText>went wrong</GradientText>
        </h1>
        <p className="text-sm text-muted mb-8">
          An unexpected error occurred. You can try again or head back home.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="text-xs tracking-[0.25em] uppercase bg-[image:var(--grad-primary)] bg-[length:200%_200%] text-white px-8 py-3.5 rounded-sm hover:bg-[position:100%_50%] transition-all"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3.5 rounded-sm hover:border-accent hover:text-accent transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
