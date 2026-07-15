"use client"

import { useSearchParams } from "next/navigation"
import { useCatalog } from "@/context/CatalogContext"
import { getLowestPrice } from "@/lib/utils"
import ProductCard from "@/components/product/ProductCard"
import ProductFilters from "@/components/product/ProductFilters"
import Reveal from "@/components/ui/Reveal"
import Breadcrumbs from "@/components/ui/Breadcrumbs"

export default function ProductsBrowser() {
  const { products, parents } = useCatalog()
  const params = useSearchParams()

  const category = params.get("category") ?? "all"
  const sort = params.get("sort") ?? "featured"
  const min = Number(params.get("min")) || 0
  const max = Number(params.get("max")) || Infinity

  const categoryId =
    category === "all"
      ? null
      : parents.find((p) => p.handle === category)?.id ?? "__none__"

  let list = products.filter((p) => {
    if (categoryId && p.parentId !== categoryId) return false
    const price = getLowestPrice(p)
    const dollars = price != null ? price / 100 : 0
    return dollars >= min && dollars <= max
  })

  list = [...list].sort((a, b) => {
    const pa = getLowestPrice(a) ?? 0
    const pb = getLowestPrice(b) ?? 0
    switch (sort) {
      case "newest":
        return b.createdAt - a.createdAt
      case "price-asc":
        return pa - pb
      case "price-desc":
        return pb - pa
      default:
        return 0
    }
  })

  return (
    <div className="pt-32 px-6 pb-28 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "All Products" }]}
        />
        <div className="mt-6 mb-10">
          <h1 className="font-display text-4xl font-semibold">All Products</h1>
          <p className="text-xs text-muted mt-2 tracking-widest">
            {list.length} {list.length === 1 ? "item" : "items"}
          </p>
        </div>

        <ProductFilters parents={parents} />

        {list.length === 0 ? (
          <p className="text-muted text-sm text-center py-24">
            No products match these filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i * 0.04, 0.3)}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
