"use client"

import Image from "next/image"
import { formatPrice } from "@/lib/utils"

export default function OrderSummary({
  items,
  subtotal,
  shipping,
}: {
  items: any[]
  subtotal: number
  shipping: number | null
}) {
  const total = subtotal + (shipping ?? 0)

  return (
    <div className="glass rounded-xl p-6">
      <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-5">
        Order summary
      </p>

      <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
        {items.map((item: any) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-14 h-16 shrink-0 relative rounded bg-card border border-border overflow-hidden">
              {item.thumbnail && (
                <Image src={item.thumbnail} alt="" fill className="object-cover" />
              )}
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-fg text-bg text-[10px] font-medium flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.title}</p>
              {item.variant?.title && (
                <p className="text-xs text-muted">{item.variant.title}</p>
              )}
            </div>
            <span className="text-sm">
              {formatPrice(item.unit_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Shipping</span>
          <span>
            {shipping == null
              ? "—"
              : shipping === 0
              ? "Free"
              : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between pt-3 mt-1 border-t border-border text-base">
          <span>Total</span>
          <span className="font-medium">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
