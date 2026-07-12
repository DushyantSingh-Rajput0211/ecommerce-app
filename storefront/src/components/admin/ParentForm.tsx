"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCatalog } from "@/context/CatalogContext"
import type { CatalogParent } from "@/types/catalog"
import { makeId, slugify, uniqueHandle } from "@/lib/catalog"
import ImageUploader from "./ImageUploader"
import Button from "@/components/ui/Button"

const inputCls =
  "w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-fg " +
  "placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
const labelCls =
  "block text-[10px] tracking-[0.25em] uppercase text-muted mb-2"

export default function ParentForm({ initial }: { initial?: CatalogParent }) {
  const router = useRouter()
  const { parents, upsertParent } = useCatalog()

  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [image, setImage] = useState<string[]>(
    initial?.image ? [initial.image] : []
  )
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!title.trim()) return setError("Category title is required.")

    const id = initial?.id ?? makeId("parent")
    const existingHandles = parents
      .filter((p) => p.id !== id)
      .map((p) => p.handle)
    const handle =
      initial?.handle ?? uniqueHandle(slugify(title), existingHandles)

    const parent: CatalogParent = {
      id,
      handle,
      title: title.trim(),
      description: description.trim(),
      image: image[0] ?? null,
      createdAt: initial?.createdAt ?? parents.length + 1,
    }
    upsertParent(parent)
    router.push("/admin")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,360px)] gap-10"
    >
      <div className="space-y-7">
        <div>
          <label className={labelCls}>Title</label>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Footwear"
          />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            className={`${inputCls} min-h-[90px] resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short category description…"
          />
        </div>
        <div>
          <label className={labelCls}>Category image</label>
          <ImageUploader value={image} onChange={setImage} multiple={false} />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="gradient">
            {initial ? "Save changes" : "Create category"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Live preview */}
      <div className="lg:sticky lg:top-24 h-fit">
        <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">
          Live preview
        </p>
        <div className="relative aspect-4/5 rounded-xl overflow-hidden border border-border bg-card glow-hover">
          {image[0] ? (
            <Image src={image[0]} alt="" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[10px] text-muted tracking-widest uppercase">
                No image
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-display text-xl font-semibold">
              {title || "Category"}
            </p>
            {description && (
              <p className="text-xs text-fg/70 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
