"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { X, ShoppingBag, Minus, Plus } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import { formatPrice } from "@/lib/utils"

export default function CartDrawer() {
  const { cart, itemCount, removeFromCart, updateQuantity } = useCart()
  const { cartOpen, closeCart } = useUI()

  // Lock body scroll while open; close on Escape.
  useEffect(() => {
    if (!cartOpen) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [cartOpen, closeCart])

  const items = cart?.items ?? []
  const subtotal = items.reduce(
    (sum: number, i: any) => sum + i.unit_price * i.quantity,
    0
  )

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed top-0 right-0 bottom-0 z-[71] w-full max-w-md glass flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
              <p className="text-xs tracking-[0.25em] uppercase">
                Cart <span className="text-muted">({itemCount})</span>
              </p>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="w-9 h-9 rounded-md text-muted hover:text-fg hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
                <ShoppingBag size={28} className="text-muted" />
                <p className="text-muted text-sm">Your cart is empty</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3 rounded-sm hover:border-accent hover:text-accent transition-colors"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 shrink-0 relative rounded-md overflow-hidden bg-card border border-border">
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
                        <p className="text-sm font-medium truncate">
                          {item.title}
                        </p>
                        {item.variant?.title && (
                          <p className="text-xs text-muted mt-0.5">
                            {item.variant.title}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="w-6 h-6 border border-border rounded flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm tabular-nums w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="w-6 h-6 border border-border rounded flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm">
                            {formatPrice(item.unit_price * item.quantity)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] text-muted hover:text-fg transition-colors mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border px-6 py-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="text-center text-xs tracking-[0.2em] uppercase border border-border py-3.5 rounded-sm hover:border-accent hover:text-accent transition-colors"
                    >
                      View cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="text-center text-xs tracking-[0.2em] uppercase bg-[image:var(--grad-primary)] bg-[length:200%_200%] text-white py-3.5 rounded-sm shadow-[0_8px_30px_-8px_rgba(124,58,237,0.6)] hover:bg-[position:100%_50%] transition-all"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
