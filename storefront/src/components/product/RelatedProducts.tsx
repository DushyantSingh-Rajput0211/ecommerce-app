"use client"

import { useCatalog } from "@/context/CatalogContext"
import ProductCard from "@/components/product/ProductCard"
import Reveal from "@/components/ui/Reveal"

/** Same-category products, excluding the current one. */
export default function RelatedProducts({
  parentId,
  excludeId,
}: {
  parentId: string
  excludeId: string
}) {
  const { getProductsByParent } = useCatalog()
  const related = getProductsByParent(parentId)
    .filter((p) => p.id !== excludeId)
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="mt-24">
      <Reveal>
        <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-8">
          You may also like
        </p>
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
        {related.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
