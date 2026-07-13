"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import ProductForm from "@/components/admin/ProductForm"
import { useCatalog } from "@/context/CatalogContext"

export default function EditProductPage() {
  const params = useParams()
  const id = String(params.id)
  const { getProductById, ready } = useCatalog()
  const product = getProductById(id)

  if (ready && !product) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted text-sm mb-4">Product not found.</p>
        <Link href="/admin" className="text-accent hover:opacity-80 text-sm">
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-8">Edit product</h1>
      {product && <ProductForm initial={product} />}
    </div>
  )
}
