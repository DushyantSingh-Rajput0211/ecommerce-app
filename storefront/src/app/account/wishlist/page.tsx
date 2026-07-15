"use client"

import Link from "next/link"
import { useWishlist } from "@/context/WishlistContext"
import { useCatalog } from "@/context/CatalogContext"
import ProductCard from "@/components/product/ProductCard"

export default function AccountWishlist() {
  const { handles } = useWishlist()
  const { getProductByHandle } = useCatalog()

  const products = handles
    .map((h) => getProductByHandle(h))
    .filter(Boolean) as any[]

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-8">Wishlist</h1>

      {products.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center">
          <p className="text-muted text-sm mb-6">
            Your wishlist is empty. Tap the heart on any product to save it.
          </p>
          <Link
            href="/products"
            className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3 rounded-sm hover:border-accent hover:text-accent transition-colors"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
