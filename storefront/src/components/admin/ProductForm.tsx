"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Trash2 } from "lucide-react"
import { useCatalog } from "@/context/CatalogContext"
import type { CatalogProduct } from "@/types/catalog"
import {
  makeId,
  slugify,
  uniqueHandle,
  PRODUCT_IMAGE_WIDTH,
  PRODUCT_IMAGE_HEIGHT,
} from "@/lib/catalog"
import { formatPrice } from "@/lib/utils"
import ImageUploader from "./ImageUploader"
import Button from "@/components/ui/Button"

interface VariantDraft {
  id: string
  title: string
  price: string // dollars, as typed
}

const inputCls =
  "w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-fg " +
  "placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
const labelCls =
  "block text-[10px] tracking-[0.25em] uppercase text-muted mb-2"

export default function ProductForm({ initial }: { initial?: CatalogProduct }) {
  const router = useRouter()
  const { parents, products, upsertProduct } = useCatalog()

  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [parentId, setParentId] = useState(
    initial?.parentId ?? parents[0]?.id ?? ""
  )
  const [images, setImages] = useState<string[]>(
    initial?.images.map((i) => i.url) ?? []
  )
  const [variants, setVariants] = useState<VariantDraft[]>(
    initial?.variants.map((v) => ({
      id: v.id,
      title: v.title,
      price: ((v.prices[0]?.amount ?? 0) / 100).toString(),
    })) ?? [{ id: makeId("var"), title: "Default", price: "" }]
  )
  const [error, setError] = useState("")

  const parent = parents.find((p) => p.id === parentId)

  const previewPrice = (() => {
    const amounts = variants
      .map((v) => parseFloat(v.price))
      .filter((n) => !isNaN(n))
    return amounts.length ? Math.min(...amounts) * 100 : null
  })()

  function updateVariant(id: string, patch: Partial<VariantDraft>) {
    setVariants((vs) => vs.map((v) => (v.id === id ? { ...v, ...patch } : v)))
  }
  function addVariant() {
    setVariants((vs) => [...vs, { id: makeId("var"), title: "", price: "" }])
  }
  function removeVariant(id: string) {
    setVariants((vs) => (vs.length > 1 ? vs.filter((v) => v.id !== id) : vs))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim()) return setError("Product title is required.")
    if (!parentId) return setError("Select a parent category.")
    const cleanVariants = variants
      .map((v) => ({ ...v, priceNum: parseFloat(v.price) }))
      .filter((v) => v.title.trim() && !isNaN(v.priceNum) && v.priceNum >= 0)
    if (cleanVariants.length === 0)
      return setError("Add at least one variant with a title and price.")

    const id = initial?.id ?? makeId("prod")
    const existingHandles = products
      .filter((p) => p.id !== id)
      .map((p) => p.handle)
    const handle =
      initial?.handle ?? uniqueHandle(slugify(title), existingHandles)

    const product: CatalogProduct = {
      id,
      handle,
      title: title.trim(),
      description: description.trim(),
      parentId,
      thumbnail: images[0] ?? null,
      images: images.map((url, i) => ({ id: `${id}_img_${i}`, url })),
      variants: cleanVariants.map((v) => ({
        id: v.id,
        title: v.title.trim(),
        prices: [{ amount: Math.round(v.priceNum * 100), currency_code: "usd" }],
      })),
      collection: parent ? { title: parent.title } : undefined,
      createdAt: initial?.createdAt ?? products.length + 1,
    }

    upsertProduct(product)
    router.push("/admin")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,360px)] gap-10"
    >
      {/* ── Form fields ─────────────────────────────── */}
      <div className="space-y-7">
        <div>
          <label className={labelCls}>Title</label>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Classic Black Hoodie"
          />
        </div>

        <div>
          <label className={labelCls}>Parent category</label>
          <select
            className={inputCls}
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            {parents.length === 0 && <option value="">No categories yet</option>}
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            className={`${inputCls} min-h-[110px] resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product…"
          />
        </div>

        <div>
          <label className={labelCls}>Images</label>
          <ImageUploader
            value={images}
            onChange={setImages}
            multiple
            max={6}
            crop={{ w: PRODUCT_IMAGE_WIDTH, h: PRODUCT_IMAGE_HEIGHT }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted">
              Variants & prices
            </label>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-accent hover:opacity-80"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {variants.map((v) => (
              <div key={v.id} className="flex gap-2">
                <input
                  className={`${inputCls} flex-1`}
                  value={v.title}
                  onChange={(e) => updateVariant(v.id, { title: e.target.value })}
                  placeholder="Variant (e.g. Medium)"
                />
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                    $
                  </span>
                  <input
                    className={`${inputCls} pl-6`}
                    value={v.price}
                    onChange={(e) =>
                      updateVariant(v.id, { price: e.target.value })
                    }
                    inputMode="decimal"
                    placeholder="0.00"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(v.id)}
                  aria-label="Remove variant"
                  className="w-10 shrink-0 rounded-md border border-border text-muted hover:text-accent hover:border-accent flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="gradient">
            {initial ? "Save changes" : "Publish product"}
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

      {/* ── Live preview ────────────────────────────── */}
      <div className="lg:sticky lg:top-24 h-fit">
        <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">
          Live preview
        </p>
        <div className="glass rounded-xl p-4">
          <div className="aspect-3/4 relative overflow-hidden bg-card rounded-lg border border-border mb-3">
            {images[0] ? (
              <Image src={images[0]} alt="" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[10px] text-muted tracking-widest uppercase">
                  No image
                </span>
              </div>
            )}
            {parent && (
              <span className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full text-[9px] tracking-widest uppercase">
                {parent.title}
              </span>
            )}
          </div>
          <p className="text-sm font-medium leading-snug">
            {title || "Product title"}
          </p>
          <p className="text-sm text-muted mt-0.5">
            {previewPrice != null ? formatPrice(previewPrice) : "—"}
          </p>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.slice(1, 5).map((url, i) => (
                <div
                  key={i}
                  className="aspect-square relative rounded-md overflow-hidden bg-card border border-border"
                >
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
