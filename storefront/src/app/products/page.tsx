import { Suspense } from "react"
import ProductsBrowser from "@/components/product/ProductsBrowser"
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton"

function ProductsFallback() {
  return (
    <div className="pt-32 px-6 pb-28 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="h-9 w-56 rounded skeleton" />
          <div className="h-3 w-24 rounded skeleton mt-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsBrowser />
    </Suspense>
  )
}
