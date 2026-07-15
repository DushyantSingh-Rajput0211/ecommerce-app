"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import type { CatalogParent } from "@/types/catalog"

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const

export default function ProductFilters({
  parents,
}: {
  parents: CatalogParent[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const category = params.get("category") ?? "all"
  const sort = params.get("sort") ?? "featured"
  const min = params.get("min") ?? ""
  const max = params.get("max") ?? ""

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString())
      if (!value || value === "all" || value === "featured") next.delete(key)
      else next.set(key, value)
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [params, pathname, router]
  )

  const chip = (activeCond: boolean) =>
    `px-4 py-2 text-xs tracking-widest uppercase border rounded-full transition-colors ${
      activeCond
        ? "bg-fg text-bg border-fg"
        : "border-border text-muted hover:border-fg hover:text-fg"
    }`

  return (
    <div className="space-y-5 mb-12">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam("category", "all")}
          className={chip(category === "all")}
        >
          All
        </button>
        {parents.map((p) => (
          <button
            key={p.id}
            onClick={() => setParam("category", p.handle)}
            className={chip(category === p.handle)}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Sort + price */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            aria-label="Sort products"
            className="appearance-none bg-card border border-border rounded-md pl-3 pr-9 py-2.5 text-xs tracking-widest uppercase text-fg focus:outline-none focus:border-accent transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="tracking-widest uppercase">Price</span>
          <input
            inputMode="numeric"
            value={min}
            onChange={(e) => setParam("min", e.target.value.replace(/\D/g, ""))}
            placeholder="Min"
            className="w-20 bg-card border border-border rounded-md px-3 py-2.5 text-fg focus:outline-none focus:border-accent transition-colors"
          />
          <span>–</span>
          <input
            inputMode="numeric"
            value={max}
            onChange={(e) => setParam("max", e.target.value.replace(/\D/g, ""))}
            placeholder="Max"
            className="w-20 bg-card border border-border rounded-md px-3 py-2.5 text-fg focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
