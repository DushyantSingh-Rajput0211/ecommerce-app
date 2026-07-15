"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useOrders } from "@/context/OrdersContext"
import { formatPrice } from "@/lib/utils"
import Spinner from "@/components/ui/Spinner"

export default function Confirmation() {
  const params = useSearchParams()
  const id = params.get("order") ?? ""
  const { getOrder, ready } = useOrders()
  const order = getOrder(id)

  if (!ready) {
    return (
      <div className="pt-32 min-h-screen flex justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    )
  }

  return (
    <div className="pt-28 px-6 pb-28 min-h-screen">
      <div className="max-w-xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, stiffness: 220 }}
          className="w-16 h-16 rounded-full mx-auto mb-7 flex items-center justify-center bg-[image:var(--grad-primary)] shadow-[0_10px_40px_-8px_rgba(124,58,237,0.7)]"
        >
          <Check size={30} className="text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h1 className="font-display text-3xl font-semibold mb-2">
            Thank you{order ? `, ${order.address.firstName}` : ""}!
          </h1>
          <p className="text-muted text-sm">
            Your order has been placed
            {order ? (
              <>
                {" "}— confirmation sent to{" "}
                <span className="text-fg">{order.email}</span>.
              </>
            ) : (
              "."
            )}
          </p>
          {order && (
            <p className="text-xs tracking-widest uppercase text-muted mt-4">
              Order <span className="text-accent">{order.id}</span>
            </p>
          )}
        </motion.div>

        {order && (
          <div className="glass rounded-xl p-6 mt-10 text-left">
            <div className="space-y-4 mb-5">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted">
                    {item.title}
                    {item.variant ? ` · ${item.variant}` : ""} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span>
                  {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border text-base">
                <span>Total</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center mt-10">
          <Link
            href="/products"
            className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3.5 rounded-sm hover:border-accent hover:text-accent transition-colors"
          >
            Continue shopping
          </Link>
          <Link
            href="/account/orders"
            className="text-xs tracking-[0.25em] uppercase bg-[image:var(--grad-primary)] bg-[length:200%_200%] text-white px-8 py-3.5 rounded-sm hover:bg-[position:100%_50%] transition-all"
          >
            View orders
          </Link>
        </div>
      </div>
    </div>
  )
}
