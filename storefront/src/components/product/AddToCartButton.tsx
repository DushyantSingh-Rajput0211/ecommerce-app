"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import { useToast } from "@/context/ToastContext"
import { formatPrice } from "@/lib/utils"
import SizeGuide from "@/components/product/SizeGuide"

const LOW_STOCK_THRESHOLD = 5

// Show a size guide when the variants look like footwear/apparel sizes.
function hasSizeVariants(product: any): boolean {
  const collection = (product.collection?.title ?? "").toLowerCase()
  if (collection.includes("footwear") || collection.includes("apparel")) return true
  return (product.variants ?? []).some((v: any) =>
    /^(us |uk |eu )?\d|^(xs|s|m|l|xl|xxl)$/i.test((v.title ?? "").trim())
  )
}

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart, isLoading } = useCart()
  const { openCart } = useUI()
  const { toast } = useToast()
  const variants = product.variants ?? []
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id ?? "")
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const selectedVariant = variants.find((v: any) => v.id === selectedId)
  const unitPrice = selectedVariant?.prices?.[0]?.amount ?? null

  // Stock: treat missing inventory as available (real Medusa may not track it).
  const stock: number | undefined = selectedVariant?.inventory_quantity
  const tracked = typeof stock === "number"
  const outOfStock = tracked && stock <= 0
  const lowStock = tracked && stock > 0 && stock <= LOW_STOCK_THRESHOLD

  const showSizeGuide = hasSizeVariants(product)
  const disabled = isLoading || !selectedId || outOfStock

  async function handleAdd() {
    if (!selectedId || outOfStock) return
    await addToCart(selectedId, quantity)
    setJustAdded(true)
    toast(`Added to cart · ${product.title}`)
    openCart()
    setTimeout(() => setJustAdded(false), 2000)
  }

  const buttonLabel = isLoading
    ? "Adding…"
    : outOfStock
    ? "Out of stock"
    : justAdded
    ? "Added ✓"
    : unitPrice != null
    ? `Add to cart · ${formatPrice(unitPrice * quantity)}`
    : "Add to cart"

  return (
    <>
      <div className="mt-auto space-y-5">
        {variants.length > 1 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted">
                Select option
              </p>
              {showSizeGuide && <SizeGuide />}
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((v: any) => {
                const vOut =
                  typeof v.inventory_quantity === "number" &&
                  v.inventory_quantity <= 0
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedId(v.id)}
                    className={`relative px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
                      selectedId === v.id
                        ? "bg-fg text-bg border-fg"
                        : "border-border text-muted hover:border-fg hover:text-fg"
                    } ${vOut ? "opacity-40" : ""}`}
                  >
                    {v.title}
                    {vOut && (
                      <span className="ml-1.5 text-[9px] normal-case tracking-normal">
                        (sold out)
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Stock indicator */}
        {tracked && (
          <p
            className={`text-xs ${
              outOfStock
                ? "text-muted"
                : lowStock
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            {outOfStock
              ? "Currently unavailable"
              : lowStock
              ? `Only ${stock} left in stock`
              : "In stock"}
          </p>
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
              onClick={() => setQuantity((q) => (tracked ? Math.min(stock!, q + 1) : q + 1))}
              disabled={tracked && quantity >= stock!}
              aria-label="Increase quantity"
              className="w-9 h-9 border border-border flex items-center justify-center
                hover:bg-fg hover:text-bg hover:border-fg transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
                disabled:hover:text-fg disabled:hover:border-border"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAdd}
          disabled={disabled}
          className="w-full py-4 text-xs tracking-[0.25em] uppercase border border-fg
            hover:bg-fg hover:text-bg transition-colors duration-200
            disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {buttonLabel}
        </button>
      </div>

      {/* Sticky mobile add-to-cart bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border px-4 py-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium truncate">{product.title}</p>
          <p className="text-xs text-muted">
            {unitPrice != null ? formatPrice(unitPrice * quantity) : "—"}
          </p>
        </div>
        <button
          onClick={handleAdd}
          disabled={disabled}
          className="shrink-0 px-6 py-3 text-xs tracking-[0.2em] uppercase rounded-sm text-white
            bg-[image:var(--grad-primary)] bg-[length:200%_200%]
            disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] transition-transform"
        >
          {outOfStock ? "Sold out" : justAdded ? "Added ✓" : "Add"}
        </button>
      </div>
    </>
  )
}
