"use client"

import { useRecentlyViewed } from "@/context/RecentlyViewedContext"
import { useCatalog } from "@/context/CatalogContext"
import ProductCard from "@/components/product/ProductCard"
import Reveal from "@/components/ui/Reveal"

/** Rail of recently viewed products. `excludeHandle` hides the current PDP item. */
export default function RecentlyViewed({
  excludeHandle,
  title = "Recently viewed",
}: {
  excludeHandle?: string
  title?: string
}) {
  const { handles } = useRecentlyViewed()
  const { getProductByHandle } = useCatalog()

  const products = handles
    .filter((h) => h !== excludeHandle)
    .map((h) => getProductByHandle(h))
    .filter(Boolean)
    .slice(0, 4)

  if (products.length === 0) return null

  return (
    <section className="mt-24">
      <Reveal>
        <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-8">
          {title}
        </p>
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
        {products.map((p: any, i: number) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
