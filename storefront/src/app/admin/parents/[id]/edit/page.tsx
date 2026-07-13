"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import ParentForm from "@/components/admin/ParentForm"
import { useCatalog } from "@/context/CatalogContext"

export default function EditParentPage() {
  const params = useParams()
  const id = String(params.id)
  const { parents, ready } = useCatalog()
  const parent = parents.find((p) => p.id === id)

  if (ready && !parent) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted text-sm mb-4">Category not found.</p>
        <Link href="/admin" className="text-accent hover:opacity-80 text-sm">
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-8">Edit category</h1>
      {parent && <ParentForm initial={parent} />}
    </div>
  )
}
