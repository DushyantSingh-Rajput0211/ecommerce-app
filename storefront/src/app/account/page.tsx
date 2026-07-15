"use client"

import Link from "next/link"
import { Package, Heart } from "lucide-react"
import { useAccount } from "@/context/AccountContext"
import { useOrders } from "@/context/OrdersContext"
import { useWishlist } from "@/context/WishlistContext"
import { formatPrice } from "@/lib/utils"

export default function AccountOverview() {
  const { user } = useAccount()
  const { orders } = useOrders()
  const { count } = useWishlist()

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">
        Welcome back{user?.name ? `, ${user.name}` : ""}
      </h1>
      <p className="text-sm text-muted mb-10">
        Manage your orders, wishlist, and details.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/account/orders"
          className="glass rounded-xl p-6 glow-hover flex items-center gap-4"
        >
          <span className="w-11 h-11 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Package size={18} />
          </span>
          <span>
            <span className="block text-2xl font-display font-semibold">
              {orders.length}
            </span>
            <span className="text-xs tracking-widest uppercase text-muted">
              Orders
            </span>
          </span>
        </Link>
        <Link
          href="/account/wishlist"
          className="glass rounded-xl p-6 glow-hover flex items-center gap-4"
        >
          <span className="w-11 h-11 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Heart size={18} />
          </span>
          <span>
            <span className="block text-2xl font-display font-semibold">
              {count}
            </span>
            <span className="text-xs tracking-widest uppercase text-muted">
              Saved items
            </span>
          </span>
        </Link>
      </div>

      {orders.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-4">
            Latest order
          </p>
          <Link
            href="/account/orders"
            className="glass rounded-xl p-5 flex items-center justify-between glow-hover"
          >
            <div>
              <p className="text-sm font-medium">{orders[0].id}</p>
              <p className="text-xs text-muted mt-0.5">
                {orders[0].items.reduce((n, i) => n + i.quantity, 0)} items
              </p>
            </div>
            <span className="text-sm">{formatPrice(orders[0].total)}</span>
          </Link>
        </div>
      )}
    </div>
  )
}
