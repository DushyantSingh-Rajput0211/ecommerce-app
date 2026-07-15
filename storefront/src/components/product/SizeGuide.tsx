"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Ruler } from "lucide-react"
import { useScrollLock } from "@/lib/useScrollLock"

const ROWS = [
  ["US 7", "40", "25.0"],
  ["US 8", "41", "26.0"],
  ["US 9", "42.5", "27.0"],
  ["US 10", "44", "28.0"],
  ["US 11", "45", "29.0"],
]

/** Trigger + modal with a generic footwear size chart. */
export default function SizeGuide() {
  const [open, setOpen] = useState(false)
  useScrollLock(open)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-muted hover:text-fg transition-colors"
      >
        <Ruler size={13} /> Size guide
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[86] w-[calc(100%-2rem)] max-w-md glass rounded-xl p-6"
              role="dialog"
              aria-label="Size guide"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-semibold">Size guide</h3>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-md text-muted hover:text-fg flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] tracking-widest uppercase text-muted">
                    <th className="text-left font-normal pb-3">US</th>
                    <th className="text-left font-normal pb-3">EU</th>
                    <th className="text-left font-normal pb-3">Foot (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r[0]} className="border-t border-border">
                      <td className="py-2.5">{r[0]}</td>
                      <td className="py-2.5 text-muted">{r[1]}</td>
                      <td className="py-2.5 text-muted">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-muted mt-5 leading-relaxed">
                Measurements are approximate. If you're between sizes, we
                recommend sizing up.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
