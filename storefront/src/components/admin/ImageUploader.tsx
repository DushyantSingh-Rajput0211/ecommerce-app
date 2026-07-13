"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { ImagePlus, X, Loader2 } from "lucide-react"
import {
  fileToCompressedDataUrl,
  fileToCoverCropDataUrl,
} from "@/lib/catalog"

/**
 * File-picker + live preview grid. Uploaded images are compressed to JPEG
 * data URLs so they fit comfortably in localStorage. Supports single or
 * multiple images; first image acts as the thumbnail.
 *
 * Pass `crop={{ w, h }}` to cover-crop every upload to exact dimensions
 * (used for product cards → uniform 1920x2560).
 */
export default function ImageUploader({
  value,
  onChange,
  multiple = true,
  max = 6,
  crop,
}: {
  value: string[]
  onChange: (urls: string[]) => void
  multiple?: boolean
  max?: number
  crop?: { w: number; h: number }
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    try {
      const incoming = Array.from(files).slice(0, max - value.length)
      const urls = await Promise.all(
        incoming.map((f) =>
          crop
            ? fileToCoverCropDataUrl(f, crop.w, crop.h)
            : fileToCompressedDataUrl(f)
        )
      )
      onChange(multiple ? [...value, ...urls].slice(0, max) : urls.slice(0, 1))
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  const canAddMore = multiple ? value.length < max : value.length === 0

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div
            key={i}
            className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-card"
          >
            <Image src={url} alt="" fill className="object-cover" />
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 glass px-2 py-0.5 rounded-full text-[9px] tracking-widest uppercase">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remove image"
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border border-dashed border-border hover:border-accent hover:text-accent text-muted flex flex-col items-center justify-center gap-2 transition-colors"
          >
            {busy ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <ImagePlus size={20} />
            )}
            <span className="text-[10px] tracking-widest uppercase">
              {busy ? "Uploading" : "Add image"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <p className="text-[11px] text-muted mt-2">
        {multiple
          ? `Up to ${max} images. The first is the cover/thumbnail.`
          : "One image."}{" "}
        {crop
          ? `Cropped to ${crop.w}×${crop.h}. `
          : ""}
        Stored locally (compressed).
      </p>
    </div>
  )
}
