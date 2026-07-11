import Link from "next/link"
import { sdk } from "@/lib/medusa"
import { mockProducts } from "@/lib/mockProducts"
import { withTimeout } from "@/lib/utils"
import ProductCard from "@/components/product/ProductCard"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  let products: any[] = []
  try {
    const res = await withTimeout(
      sdk.store.product.list({
        limit: 4,
        fields: "id,handle,title,thumbnail,variants.prices",
      })
    )
    products = res.products
  } catch {
    products = []
  }

  // Fall back to mock products for UI testing when the backend has none.
  if (products.length === 0) products = mockProducts.slice(0, 4)

  return (
    <div className="pt-16">
      <section className="min-h-[88vh] flex flex-col justify-end pb-14 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <h1
            className="leading-none font-medium tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
          >
            New season.
          </h1>
          <div className="flex items-end justify-between mt-10">
            <p className="text-muted text-sm max-w-xs leading-relaxed">
              Limited quantities. Shipped worldwide.
            </p>
            <Link
              href="/products"
              className="text-xs tracking-[0.2em] uppercase border border-border px-7 py-3 hover:bg-fg hover:text-bg transition-colors duration-200"
            >
              Shop all
            </Link>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="px-6 pb-28">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-8">
              Featured
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
              {products.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
