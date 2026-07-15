import type { CatalogProduct } from "@/types/catalog"

/**
 * Lightweight client-side product search. Scores each product by where the
 * query matches (title > category > description) and returns the best matches.
 * No dependency — good enough for a local catalog; swap for Algolia/Medusa
 * search later without changing callers.
 */
export function searchProducts(
  products: CatalogProduct[],
  query: string,
  limit = 8
): CatalogProduct[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const terms = q.split(/\s+/)

  const scored = products
    .map((p) => {
      const title = p.title.toLowerCase()
      const collection = (p.collection?.title ?? "").toLowerCase()
      const description = (p.description ?? "").toLowerCase()

      let score = 0
      for (const term of terms) {
        if (title.includes(term)) score += title.startsWith(term) ? 6 : 4
        if (collection.includes(term)) score += 2
        if (description.includes(term)) score += 1
      }
      return { product: p, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((s) => s.product)
}

const RECENT_KEY = "recent_searches"

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]")
  } catch {
    return []
  }
}

export function addRecentSearch(query: string) {
  if (typeof window === "undefined") return
  const q = query.trim()
  if (!q) return
  const next = [q, ...getRecentSearches().filter((s) => s !== q)].slice(0, 5)
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}
