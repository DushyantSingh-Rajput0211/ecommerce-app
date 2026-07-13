"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useCatalog } from "@/context/CatalogContext"
import { formatPrice } from "@/lib/utils"
import AddToCartButton from "@/components/product/AddToCartButton"
import ImageGallery from "@/components/product/ImageGallery"
import Spinner from "@/components/ui/Spinner"

export default function ProductPage() {
  const params = useParams()
  const handle = String(params.handle)
  const { getProductByHandle, getParentByHandle, parents, ready } = useCatalog()

  const product = getProductByHandle(handle)

  // Before localStorage hydration an admin-created product may be unresolved,
  // so only treat it as missing once the catalog is ready.
  if (!product && !ready) {
    return (
      <div className="pt-32 min-h-screen flex justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-32 px-6 min-h-screen text-center">
        <p className="text-muted text-sm mb-6">Product not found.</p>
        <Link
          href="/products"
          className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3 hover:bg-fg hover:text-bg transition-colors"
        >
          Browse all products
        </Link>
      </div>
    )
  }

  const parent = parents.find((p) => p.id === product.parentId)
  const images = product.images ?? []
  const firstVariantPrice = product.variants?.[0]?.prices?.[0]

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <nav className="text-[11px] tracking-widest uppercase text-muted mb-8">
          <Link href="/" className="hover:text-fg transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          {parent && (
            <>
              <Link
                href={`/category/${parent.handle}`}
                className="hover:text-fg transition-colors"
              >
                {parent.title}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-fg">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <ImageGallery images={images} title={product.title} />

          <div className="flex flex-col pt-4">
            <p className="text-[10px] tracking-[0.35em] uppercase text-accent mb-4">
              {parent?.title ?? product.collection?.title ?? "New"}
            </p>
            <h1 className="font-display text-3xl font-semibold mb-3">
              {product.title}
            </h1>
            <p className="text-xl mb-8">
              {firstVariantPrice
                ? formatPrice(firstVariantPrice.amount)
                : "—"}
            </p>

            {product.description && (
              <p className="text-sm text-muted leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
