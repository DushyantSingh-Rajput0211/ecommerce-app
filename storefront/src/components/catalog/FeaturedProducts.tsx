"use client"

import Link from "next/link"
import { useCatalog } from "@/context/CatalogContext"
import ProductCard from "@/components/product/ProductCard"
import Reveal from "@/components/ui/Reveal"

/** Home-page featured rail — the newest products across the catalog. */
export default function FeaturedProducts({ limit = 4 }: { limit?: number }) {
  const { products } = useCatalog()
  if (products.length === 0) return null

  const featured = [...products]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit)

  return (
    <section className="px-6 pb-28">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex items-end justify-between mb-8">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted">
              Featured
            </p>
            <Link
              href="/products"
              className="text-[10px] tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors"
            >
              View all →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
