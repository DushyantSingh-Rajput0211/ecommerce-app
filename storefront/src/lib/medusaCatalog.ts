import { sdk } from "@/lib/medusa"
import { withTimeout } from "@/lib/utils"
import type { Catalog, CatalogParent, CatalogProduct } from "@/types/catalog"

/**
 * Loads the catalog from a live Medusa backend and adapts it to the
 * storefront's `Catalog` shape, so every existing component works unchanged.
 *
 * Returns `null` when Medusa isn't configured/reachable or has no products —
 * the caller then falls back to the local (localStorage/seed) catalog. This is
 * what lets the deployed demo keep working until the backend is live.
 *
 * Medusa v2 prices are decimal (e.g. 10 = €10); we convert to cents to match
 * `formatPrice` (which divides by 100).
 */

function toCents(amount: number | undefined | null): number {
  return Math.round((amount ?? 0) * 100)
}

function adaptProduct(p: any, fallbackCurrency: string): CatalogProduct {
  const category = (p.categories ?? [])[0]
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description ?? "",
    parentId: category?.id ?? "uncategorized",
    thumbnail: p.thumbnail ?? p.images?.[0]?.url ?? null,
    images: (p.images ?? []).map((im: any, i: number) => ({
      id: im.id ?? `${p.id}_img_${i}`,
      url: im.url,
    })),
    variants: (p.variants ?? []).map((v: any) => ({
      id: v.id,
      title: v.title ?? "Default",
      prices: [
        {
          amount: toCents(v.calculated_price?.calculated_amount),
          currency_code: v.calculated_price?.currency_code ?? fallbackCurrency,
        },
      ],
      inventory_quantity: v.inventory_quantity,
    })),
    collection: category ? { title: category.name } : undefined,
    createdAt: 0,
  }
}

export async function loadMedusaCatalog(): Promise<Catalog | null> {
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  // Skip when unconfigured or still the placeholder key.
  if (!key || key.startsWith("pk_your")) return null

  try {
    const regionsRes: any = await withTimeout(sdk.store.region.list(), 4000)
    const regions = regionsRes?.regions ?? []
    if (!regions.length) return null
    const region =
      regions.find((r: any) => r.currency_code === "usd") ?? regions[0]
    const currency = region.currency_code

    const productsRes: any = await withTimeout(
      sdk.store.product.list({
        limit: 100,
        region_id: region.id,
        fields:
          "id,title,handle,description,thumbnail,*images,*categories,*variants,*variants.calculated_price",
      } as any),
      6000
    )
    const products = productsRes?.products ?? []
    if (!products.length) return null

    const catalogProducts = products.map((p: any) =>
      adaptProduct(p, currency)
    )

    // Derive parent categories from the categories present on products.
    // Category image = the first product's image in that category.
    const parentMap = new Map<string, CatalogParent>()
    for (const p of products) {
      for (const c of p.categories ?? []) {
        if (!parentMap.has(c.id)) {
          parentMap.set(c.id, {
            id: c.id,
            handle: c.handle,
            title: c.name,
            description: c.description ?? "",
            image: p.thumbnail ?? p.images?.[0]?.url ?? null,
            createdAt: 0,
          })
        }
      }
    }

    return { parents: [...parentMap.values()], products: catalogProducts }
  } catch {
    return null
  }
}
