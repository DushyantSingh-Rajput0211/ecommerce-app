"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useScrollLock } from "@/lib/useScrollLock"

export default function ImageGallery({
  images,
  title,
}: {
  images: any[]
  title: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const active = images[activeIndex]
  const hasImages = images.length > 0

  useScrollLock(lightbox)

  const next = () => setActiveIndex((i) => (i + 1) % images.length)
  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false)
      else if (e.key === "ArrowRight") next()
      else if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, images.length])

  return (
    <div>
      <button
        type="button"
        onClick={() => hasImages && setLightbox(true)}
        aria-label="Zoom image"
        className="group aspect-square relative overflow-hidden bg-card rounded-sm w-full block cursor-zoom-in"
      >
        {active ? (
          <Image
            key={activeIndex}
            src={active.url}
            alt={title}
            fill
            priority
            className="object-cover animate-[fadeIn_0.3s_ease]"
          />
        ) : (
          <div className="w-full h-full bg-card" />
        )}
        {hasImages && (
          <span className="absolute bottom-3 right-3 glass w-9 h-9 rounded-full flex items-center justify-center text-fg opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} />
          </span>
        )}
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.slice(0, 8).map((img: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`aspect-square relative overflow-hidden bg-card rounded-sm border transition-colors ${
                i === activeIndex
                  ? "border-fg"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className={`object-cover transition-opacity ${
                  i === activeIndex ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              aria-label="Close"
              className="absolute top-5 right-5 w-11 h-11 rounded-full glass flex items-center justify-center text-fg hover:text-accent transition-colors z-10"
            >
              <X size={20} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prev()
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 md:left-8 w-11 h-11 rounded-full glass flex items-center justify-center text-fg hover:text-accent transition-colors z-10"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    next()
                  }}
                  aria-label="Next image"
                  className="absolute right-4 md:right-8 w-11 h-11 rounded-full glass flex items-center justify-center text-fg hover:text-accent transition-colors z-10"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-[92vw] h-[86vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.url}
                alt={title}
                fill
                className="object-contain"
                sizes="92vw"
              />
            </motion.div>

            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-widest text-fg/70">
                {activeIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
