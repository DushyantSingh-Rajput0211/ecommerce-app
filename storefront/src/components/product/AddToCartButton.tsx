"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart, isLoading } = useCart()
  const variants = product.variants ?? []
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id ?? "")
  const [justAdded, setJustAdded] = useState(false)

  async function handleAdd() {
    if (!selectedId) return
    await addToCart(selectedId, 1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div className="mt-auto space-y-5">
      {variants.length > 1 && (
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-3">
            Select size
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

      <button
        onClick={handleAdd}
        disabled={isLoading || !selectedId}
        className="w-full py-4 text-xs tracking-[0.25em] uppercase border border-fg
          hover:bg-fg hover:text-bg transition-colors duration-200
          disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {isLoading ? "Adding…" : justAdded ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  )
}
