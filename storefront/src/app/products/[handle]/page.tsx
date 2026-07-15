"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useCatalog } from "@/context/CatalogContext"
import { useReviews } from "@/context/ReviewsContext"
import { useRecentlyViewed } from "@/context/RecentlyViewedContext"
import { formatPrice } from "@/lib/utils"
import AddToCartButton from "@/components/product/AddToCartButton"
import ImageGallery from "@/components/product/ImageGallery"
import RelatedProducts from "@/components/product/RelatedProducts"
import RecentlyViewed from "@/components/product/RecentlyViewed"
import Reviews from "@/components/product/Reviews"
import WishlistButton from "@/components/product/WishlistButton"
import Spinner from "@/components/ui/Spinner"
import Breadcrumbs from "@/components/ui/Breadcrumbs"
import { Stars } from "@/components/ui/Stars"

export default function ProductPage() {
  const params = useParams()
  const handle = String(params.handle)
  const { getProductByHandle, parents, ready } = useCatalog()
  const { getSummary } = useReviews()
  const { record } = useRecentlyViewed()

  const product = getProductByHandle(handle)

  useEffect(() => {
    if (product) record(handle)
  }, [product, handle, record])

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
  const summary = getSummary(handle)

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 pb-28 md:pb-16">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              ...(parent
                ? [{ label: parent.title, href: `/category/${parent.handle}` }]
                : []),
              { label: product.title },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <ImageGallery images={images} title={product.title} />

          <div className="flex flex-col pt-4">
            <p className="text-[10px] tracking-[0.35em] uppercase text-accent mb-4">
              {parent?.title ?? product.collection?.title ?? "New"}
            </p>
            <h1 className="font-display text-3xl font-semibold mb-3">
              {product.title}
            </h1>

            {summary.count > 0 && (
              <a
                href="#reviews"
                className="flex items-center gap-2 mb-4 w-fit group"
              >
                <Stars rating={summary.average} size={15} />
                <span className="text-xs text-muted group-hover:text-fg transition-colors">
                  {summary.average.toFixed(1)} · {summary.count} review
                  {summary.count === 1 ? "" : "s"}
                </span>
              </a>
            )}

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
            <div className="mt-3">
              <WishlistButton
                handle={product.handle}
                title={product.title}
                variant="inline"
              />
            </div>
          </div>
        </div>

        {parent && (
          <RelatedProducts parentId={parent.id} excludeId={product.id} />
        )}

        <RecentlyViewed excludeHandle={handle} />

        <div id="reviews" className="scroll-mt-24">
          <Reviews handle={handle} />
        </div>
      </div>
    </div>
  )
}
