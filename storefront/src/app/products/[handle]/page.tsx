import Image from "next/image"
import { notFound } from "next/navigation"
import { sdk } from "@/lib/medusa"
import { formatPrice } from "@/lib/utils"
import AddToCartButton from "@/components/product/AddToCartButton"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ handle: string }>
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  let products: any[] = []
  try {
    const res = await sdk.store.product.list({
      handle,
      fields: "*variants,*variants.prices,*images",
    })
    products = res.products
  } catch {
    notFound()
  }

  const product = products[0]
  if (!product) notFound()

  const images = (product as any).images ?? []
  const firstVariantPrice = product.variants?.[0]?.prices?.[0]

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <div className="aspect-square relative overflow-hidden bg-card rounded-sm">
              {images[0] ? (
                <Image
                  src={images[0].url}
                  alt={product.title ?? ""}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-card" />
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.slice(1, 5).map((img: any, i: number) => (
                  <div
                    key={i}
                    className="aspect-square relative overflow-hidden bg-card rounded-sm"
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

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
