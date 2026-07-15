import Link from "next/link"
import Image from "next/image"
import { formatPrice, getLowestPrice } from "@/lib/utils"
import WishlistButton from "@/components/product/WishlistButton"

export default function ProductCard({ product }: { product: any }) {
  const price = getLowestPrice(product)
  const collection = product.collection?.title

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="aspect-3/4 relative overflow-hidden bg-card mb-3 rounded-lg border border-border glow-hover">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] text-muted tracking-widest uppercase">
              No image
            </span>
          </div>
        )}

        {/* Gradient wash that fades in on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {collection && (
          <span className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full text-[9px] tracking-widest uppercase text-fg/90">
            {collection}
          </span>
        )}

        <WishlistButton handle={product.handle} title={product.title} />
      </div>

      <p className="text-sm font-medium leading-snug transition-colors group-hover:text-accent">
        {product.title}
      </p>
      <p className="text-sm text-muted mt-0.5">
        {price ? formatPrice(price) : "—"}
      </p>
    </Link>
  )
}
