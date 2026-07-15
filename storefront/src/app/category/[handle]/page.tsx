"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useCatalog } from "@/context/CatalogContext"
import ProductCard from "@/components/product/ProductCard"
import Reveal from "@/components/ui/Reveal"
import Spinner from "@/components/ui/Spinner"
import Breadcrumbs from "@/components/ui/Breadcrumbs"

export default function CategoryPage() {
  const params = useParams()
  const handle = String(params.handle)
  const { getParentByHandle, getProductsByParent, ready } = useCatalog()

  const parent = getParentByHandle(handle)

  // Only a genuinely missing category (after localStorage hydration) is a 404;
  // before hydration, an admin-created category may not be resolved yet.
  if (!parent && !ready) {
    return (
      <div className="pt-32 min-h-screen flex justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    )
  }

  if (!parent) {
    return (
      <div className="pt-32 px-6 min-h-screen text-center">
        <p className="text-muted text-sm mb-6">Category not found.</p>
        <Link
          href="/products"
          className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3 hover:bg-fg hover:text-bg transition-colors"
        >
          Browse all products
        </Link>
      </div>
    )
  }

  const products = getProductsByParent(parent.id)

  return (
    <div className="pt-32 px-6 pb-28 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: parent.title },
          ]}
        />

        <div className="mt-6 mb-12 max-w-2xl">
          <h1 className="font-display text-4xl font-semibold mb-3">
            {parent.title}
          </h1>
          {parent.description && (
            <p className="text-sm text-muted leading-relaxed">
              {parent.description}
            </p>
          )}
          <p className="text-xs text-muted tracking-widest mt-3">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-muted text-sm text-center py-24">
            No products in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
