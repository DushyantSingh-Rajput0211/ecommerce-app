import { sdk } from "@/lib/medusa"
import { mockProducts } from "@/lib/mockProducts"
import { withTimeout } from "@/lib/utils"
import ProductCard from "@/components/product/ProductCard"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  let products: any[] = []
  try {
    const res = await withTimeout(
      sdk.store.product.list({
        limit: 100,
        fields: "id,handle,title,thumbnail,variants.prices",
      })
    )
    products = res.products
  } catch {
    products = []
  }

  // Fall back to mock products for UI testing when the backend has none.
  if (products.length === 0) products = mockProducts

  return (
    <div className="pt-32 px-6 pb-28">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h1 className="text-2xl font-medium">All Products</h1>
          <p className="text-xs text-muted mt-2 tracking-widest">
            {products.length} items
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-muted text-sm text-center py-32">
            No products yet. Add them in the Medusa admin dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
