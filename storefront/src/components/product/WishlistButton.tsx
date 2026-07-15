"use client"

import { Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useWishlist } from "@/context/WishlistContext"
import { useToast } from "@/context/ToastContext"

/**
 * Heart toggle. Used as an overlay on ProductCard and inline on the PDP.
 * Stops event propagation so it doesn't trigger a wrapping link.
 */
export default function WishlistButton({
  handle,
  title,
  variant = "overlay",
}: {
  handle: string
  title?: string
  variant?: "overlay" | "inline"
}) {
  const { has, toggle } = useWishlist()
  const { toast } = useToast()
  const active = has(handle)

  function onClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggle(handle)
    toast(
      active
        ? "Removed from wishlist"
        : `Saved to wishlist${title ? ` · ${title}` : ""}`,
      "info"
    )
  }

  const base =
    "flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"

  if (variant === "inline") {
    return (
      <button
        onClick={onClick}
        aria-pressed={active}
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        className={`${base} w-full gap-2 border border-border rounded-sm px-4 py-4 text-xs tracking-[0.2em] uppercase hover:border-fg ${
          active ? "text-accent border-accent/50" : "text-muted"
        }`}
      >
        <Heart size={16} fill={active ? "currentColor" : "none"} />
        {active ? "Saved" : "Save"}
      </button>
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`${base} absolute top-3 right-3 w-8 h-8 rounded-full glass ${
        active ? "text-accent" : "text-fg/80 hover:text-fg"
      }`}
    >
      <Heart size={15} fill={active ? "currentColor" : "none"} />
    </motion.button>
  )
}
