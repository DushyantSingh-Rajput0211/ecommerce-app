"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { formatPrice } from "@/lib/utils"

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart, isLoading } = useCart()
  const variants = product.variants ?? []
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id ?? "")
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const selectedVariant = variants.find((v: any) => v.id === selectedId)
  const unitPrice = selectedVariant?.prices?.[0]?.amount ?? null

  async function handleAdd() {
    if (!selectedId) return
    await addToCart(selectedId, quantity)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div className="mt-auto space-y-5">
      {variants.length > 1 && (
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-3">
            Select option
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v: any) => (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
                  selectedId === v.id
                    ? "bg-fg text-bg border-fg"
                    : "border-border text-muted hover:border-fg hover:text-fg"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity stepper */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-3">
          Quantity
        </p>
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="w-9 h-9 border border-border flex items-center justify-center
              hover:bg-fg hover:text-bg hover:border-fg transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
              disabled:hover:text-fg disabled:hover:border-border"
          >
            −
          </button>
          <span className="w-6 text-center tabular-nums">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="w-9 h-9 border border-border flex items-center justify-center
              hover:bg-fg hover:text-bg hover:border-fg transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={isLoading || !selectedId}
        className="w-full py-4 text-xs tracking-[0.25em] uppercase border border-fg
          hover:bg-fg hover:text-bg transition-colors duration-200
          disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {isLoading
          ? "Adding…"
          : justAdded
          ? "Added ✓"
          : unitPrice != null
          ? `Add to cart · ${formatPrice(unitPrice * quantity)}`
          : "Add to cart"}
      </button>
    </div>
  )
}
