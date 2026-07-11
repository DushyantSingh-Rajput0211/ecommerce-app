import { notFound } from "next/navigation"
import { sdk } from "@/lib/medusa"
import { mockProducts } from "@/lib/mockProducts"
import { formatPrice, withTimeout } from "@/lib/utils"
import AddToCartButton from "@/components/product/AddToCartButton"
import ImageGallery from "@/components/product/ImageGallery"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ handle: string }>
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  let products: any[] = []
  try {
    const res = await withTimeout(
      sdk.store.product.list({
        handle,
        fields: "*variants,*variants.prices,*images",
      })
    )
    products = res.products
  } catch {
    products = []
  }

  // Fall back to a matching mock product for UI testing.
  let product = products[0]
  if (!product) product = mockProducts.find((p) => p.handle === handle)
  if (!product) notFound()

  const images = (product as any).images ?? []
  const firstVariantPrice = product.variants?.[0]?.prices?.[0]

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <ImageGallery images={images} title={product.title ?? ""} />

          <div className="flex flex-col pt-4">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-4">
              {(product as any).collection?.title ?? "New"}
            </p>
            <h1 className="text-2xl font-medium mb-3">{product.title}</h1>
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
