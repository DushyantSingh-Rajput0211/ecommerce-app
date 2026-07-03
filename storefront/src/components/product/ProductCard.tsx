import Link from "next/link"
import Image from "next/image"
import { formatPrice, getLowestPrice } from "@/lib/utils"

export default function ProductCard({ product }: { product: any }) {
  const price = getLowestPrice(product)

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="aspect-[3/4] relative overflow-hidden bg-card mb-3 rounded-sm">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] text-muted tracking-widest uppercase">
              No image
            </span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium leading-snug">{product.title}</p>
      <p className="text-sm text-muted mt-0.5">
        {price ? formatPrice(price) : "—"}
      </p>
    </Link>
  )
}
