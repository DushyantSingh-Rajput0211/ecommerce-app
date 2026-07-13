"use client"

import { useCatalog } from "@/context/CatalogContext"
import ProductCard from "@/components/product/ProductCard"
import Reveal from "@/components/ui/Reveal"

export default function ProductsPage() {
  const { products } = useCatalog()

  return (
    <div className="pt-32 px-6 pb-28 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h1 className="font-display text-4xl font-semibold">All Products</h1>
          <p className="text-xs text-muted mt-2 tracking-widest">
            {products.length} items
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-muted text-sm text-center py-32">
            No products yet. Add them in the admin dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
