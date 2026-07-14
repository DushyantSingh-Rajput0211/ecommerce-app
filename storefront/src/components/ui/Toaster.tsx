"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, X, Info, AlertCircle } from "lucide-react"
import { useToast, ToastType } from "@/context/ToastContext"

const icons: Record<ToastType, typeof Check> = {
  success: Check,
  error: AlertCircle,
  info: Info,
}

const accents: Record<ToastType, string> = {
  success: "text-emerald-400 border-emerald-400/30",
  error: "text-red-400 border-red-400/30",
  info: "text-accent border-accent/30",
}

export default function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="glass rounded-lg pl-3 pr-2 py-3 flex items-center gap-3 min-w-[240px] max-w-[340px] pointer-events-auto shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]"
            >
              <span
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${accents[t.type]}`}
              >
                <Icon size={13} />
              </span>
              <p className="text-sm text-fg flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="w-6 h-6 rounded-md text-muted hover:text-fg flex items-center justify-center shrink-0 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
