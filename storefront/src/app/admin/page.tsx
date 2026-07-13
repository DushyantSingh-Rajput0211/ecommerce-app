"use client"

import Link from "next/link"
import Image from "next/image"
import { Pencil, Trash2, Plus, PackagePlus, RotateCcw } from "lucide-react"
import { useCatalog } from "@/context/CatalogContext"
import { formatPrice, getLowestPrice } from "@/lib/utils"
import Button from "@/components/ui/Button"

export default function AdminDashboard() {
  const {
    parents,
    products,
    getProductsByParent,
    deleteParent,
    deleteProduct,
    resetCatalog,
  } = useCatalog()

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Catalog</h1>
          <p className="text-sm text-muted mt-1">
            {parents.length} categories · {products.length} products
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/parents/new">
            <Button variant="outline" size="sm">
              <Plus size={14} /> Category
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button variant="gradient" size="sm">
              <PackagePlus size={14} /> Product
            </Button>
          </Link>
        </div>
      </div>

      {parents.map((parent) => {
        const items = getProductsByParent(parent.id)
        return (
          <section key={parent.id} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg overflow-hidden bg-card border border-border relative shrink-0">
                  {parent.image && (
                    <Image
                      src={parent.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{parent.title}</p>
                  <p className="text-xs text-muted">
                    {items.length} product{items.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/admin/parents/${parent.id}/edit`}
                  aria-label="Edit category"
                  className="w-9 h-9 rounded-md border border-border text-muted hover:text-fg hover:border-fg flex items-center justify-center transition-colors"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Delete "${parent.title}" and its ${items.length} product(s)?`
                      )
                    )
                      deleteParent(parent.id)
                  }}
                  aria-label="Delete category"
                  className="w-9 h-9 rounded-md border border-border text-muted hover:text-red-400 hover:border-red-400/50 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-muted py-3">
                No products yet.{" "}
                <Link
                  href="/admin/products/new"
                  className="text-accent hover:opacity-80"
                >
                  Add one →
                </Link>
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((product) => {
                  const price = getLowestPrice(product)
                  return (
                    <div
                      key={product.id}
                      className="border border-border rounded-lg overflow-hidden bg-card"
                    >
                      <div className="aspect-square relative bg-bg">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted uppercase tracking-widest">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {price != null ? formatPrice(price) : "—"} ·{" "}
                          {product.variants.length} var.
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="flex-1 text-center text-[10px] tracking-widest uppercase py-1.5 rounded border border-border text-muted hover:text-fg hover:border-fg transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${product.title}"?`))
                                deleteProduct(product.id)
                            }}
                            aria-label="Delete product"
                            className="w-8 rounded border border-border text-muted hover:text-red-400 hover:border-red-400/50 flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}

      {parents.length === 0 && (
        <div className="text-center py-20 glass rounded-xl">
          <p className="text-muted text-sm mb-6">
            No categories yet. Create your first parent category to get started.
          </p>
          <Link href="/admin/parents/new">
            <Button variant="gradient">
              <Plus size={14} /> Create category
            </Button>
          </Link>
        </div>
      )}

      <div className="pt-4 border-t border-border">
        <button
          onClick={() => {
            if (confirm("Reset the catalog to the default sample data?"))
              resetCatalog()
          }}
          className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-muted hover:text-fg transition-colors"
        >
          <RotateCcw size={13} /> Reset to sample data
        </button>
      </div>
    </div>
  )
}
