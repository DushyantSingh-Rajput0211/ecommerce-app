"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { fadeUp } from "@/lib/motion"

/**
 * Scroll-reveal wrapper. Children fade+rise into view once, when scrolled to.
 * `delay` staggers multiple Reveals; `as` picks the rendered element.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
