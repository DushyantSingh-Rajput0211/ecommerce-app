"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { formatPrice } from "@/lib/utils"
import {
  FREE_SHIPPING_THRESHOLD,
  amountToFreeShipping,
  shippingCost,
} from "@/lib/checkout"
import TrustBadges from "@/components/ui/TrustBadges"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, itemCount } = useCart()

  if (!cart || itemCount === 0) {
    return (
      <div className="pt-32 px-6 min-h-screen">
        <div className="max-w-2xl mx-auto text-center py-28">
          <p className="text-muted text-sm mb-8">Your cart is empty</p>
          <Link
            href="/products"
            className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3
              hover:bg-fg hover:text-bg transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  const subtotal =
    cart.items?.reduce(
      (sum: number, item: any) => sum + item.unit_price * item.quantity,
      0
    ) ?? 0

  return (
    <div className="pt-32 px-6 pb-28 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium mb-12">
          Cart <span className="text-muted font-normal text-base">({itemCount})</span>
        </h1>

        <div className="space-y-6 mb-12">
          {cart.items?.map((item: any) => (
            <div
              key={item.id}
              className="flex gap-5 pb-6 border-b border-border last:border-0"
            >
              <div className="w-20 h-20 flex-shrink-0 relative bg-card rounded-sm overflow-hidden">
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted mt-1">{item.variant?.title}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 border border-border flex items-center justify-center
                        hover:bg-fg hover:text-bg hover:border-fg transition-colors"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 border border-border flex items-center justify-center
                        hover:bg-fg hover:text-bg hover:border-fg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-sm">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-muted hover:text-fg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free-shipping progress */}
        {(() => {
          const remaining = amountToFreeShipping(subtotal)
          const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
          return (
            <div className="mb-8">
              <p className="text-xs text-muted mb-2">
                {remaining > 0 ? (
                  <>
                    Add{" "}
                    <span className="text-fg">{formatPrice(remaining)}</span> for
                    free standard shipping
                  </>
                ) : (
                  <span className="text-emerald-400">
                    You&apos;ve unlocked free standard shipping ✓
                  </span>
                )}
              </p>
              <div className="h-1.5 rounded-full bg-card overflow-hidden">
                <div
                  className="h-full bg-[image:var(--grad-primary)] transition-[width] duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })()}

        <div className="border-t border-border pt-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">Est. shipping (standard)</span>
            <span>
              {shippingCost("standard", subtotal) === 0
                ? "Free"
                : formatPrice(shippingCost("standard", subtotal))}
            </span>
          </div>
          <div className="flex justify-between text-base pt-3 mt-1 border-t border-border mb-8">
            <span>Estimated total</span>
            <span className="font-medium">
              {formatPrice(subtotal + shippingCost("standard", subtotal))}
            </span>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center py-4 text-xs tracking-[0.25em] uppercase
              bg-[image:var(--grad-primary)] bg-[length:200%_200%] text-white rounded-sm
              hover:bg-[position:100%_50%] transition-all
              shadow-[0_8px_30px_-8px_rgba(124,58,237,0.6)]"
          >
            Proceed to checkout
          </Link>
          <TrustBadges className="justify-center mt-8" />
        </div>
      </div>
    </div>
  )
}
