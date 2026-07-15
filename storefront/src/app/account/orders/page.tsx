"use client"

import Link from "next/link"
import Image from "next/image"
import { useOrders } from "@/context/OrdersContext"
import { formatPrice } from "@/lib/utils"

export default function AccountOrders() {
  const { orders } = useOrders()

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-8">Orders</h1>

      {orders.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center">
          <p className="text-muted text-sm mb-6">No orders yet.</p>
          <Link
            href="/products"
            className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3 rounded-sm hover:border-accent hover:text-accent transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => (
            <div key={o.id} className="glass rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                <div>
                  <p className="text-sm font-medium">{o.id}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {o.items.reduce((n, i) => n + i.quantity, 0)} items ·{" "}
                    {o.shippingMethod} shipping
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice(o.total)}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 pt-4">
                {o.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-muted"
                  >
                    <div className="w-10 h-12 relative rounded bg-card border border-border overflow-hidden">
                      {item.thumbnail && (
                        <Image
                          src={item.thumbnail}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="max-w-[140px] truncate">
                      {item.title} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
