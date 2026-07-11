"use client"

import { useState } from "react"
import Image from "next/image"

export default function ImageGallery({
  images,
  title,
}: {
  images: any[]
  title: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex]

  return (
    <div>
      <div className="aspect-square relative overflow-hidden bg-card rounded-sm">
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
      </div>

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
    </div>
  )
}
