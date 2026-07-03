"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function Header() {
  const { itemCount } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="text-xs font-medium tracking-[0.3em] uppercase"
        >
          My Store
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-xs tracking-widest uppercase text-muted hover:text-fg transition-colors"
          >
            Shop
          </Link>
        </nav>

        <Link href="/cart" className="relative">
          <ShoppingBag size={18} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-fg text-bg text-[10px] font-medium flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
