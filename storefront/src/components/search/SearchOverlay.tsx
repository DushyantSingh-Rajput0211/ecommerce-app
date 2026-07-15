"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Search, X, Clock, CornerDownLeft } from "lucide-react"
import { useUI } from "@/context/UIContext"
import { useCatalog } from "@/context/CatalogContext"
import { useScrollLock } from "@/lib/useScrollLock"
import {
  searchProducts,
  getRecentSearches,
  addRecentSearch,
} from "@/lib/search"
import { formatPrice, getLowestPrice } from "@/lib/utils"

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI()
  const { products } = useCatalog()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [recent, setRecent] = useState<string[]>([])

  useScrollLock(searchOpen)

  const results = useMemo(
    () => searchProducts(products, query),
    [products, query]
  )

  // Focus input + load recent searches when opened; reset on close.
  useEffect(() => {
    if (searchOpen) {
      setRecent(getRecentSearches())
      setQuery("")
      setActive(0)
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [searchOpen])

  useEffect(() => setActive(0), [query])

  function go(handle: string) {
    if (query.trim()) addRecentSearch(query)
    closeSearch()
    router.push(`/products/${handle}`)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") return closeSearch()
    if (!results.length) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => (a + 1) % results.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % results.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      go(results[active].handle)
    }
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-24 -translate-x-1/2 z-[81] w-[calc(100%-2rem)] max-w-xl"
            role="dialog"
            aria-label="Search products"
          >
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search size={18} className="text-muted shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search products…"
                  className="flex-1 bg-transparent py-4 text-sm focus:outline-none placeholder:text-muted"
                />
                <button
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="w-8 h-8 rounded-md text-muted hover:text-fg flex items-center justify-center shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[52vh] overflow-y-auto">
                {query && results.length === 0 && (
                  <p className="px-4 py-10 text-center text-sm text-muted">
                    No results for “{query}”.
                  </p>
                )}

                {!query && recent.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-2 text-[10px] tracking-[0.25em] uppercase text-muted">
                      Recent
                    </p>
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => setQuery(r)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm text-muted hover:text-fg hover:bg-white/5 transition-colors"
                      >
                        <Clock size={14} /> {r}
                      </button>
                    ))}
                  </div>
                )}

                {results.map((p, i) => {
                  const price = getLowestPrice(p)
                  return (
                    <button
                      key={p.id}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(p.handle)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        i === active ? "bg-white/5" : ""
                      }`}
                    >
                      <div className="w-11 h-14 shrink-0 relative rounded bg-card border border-border overflow-hidden">
                        {p.thumbnail && (
                          <Image
                            src={p.thumbnail}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.title}</p>
                        <p className="text-xs text-muted">
                          {p.collection?.title}
                          {price != null ? ` · ${formatPrice(price)}` : ""}
                        </p>
                      </div>
                      {i === active && (
                        <CornerDownLeft size={14} className="text-muted shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
