/**
 * Local-first catalog types. The storefront reads products in a Medusa-like
 * shape so existing components (ProductCard, PDP) work unchanged. Everything
 * is persisted to localStorage; the admin UI is the CRUD surface. Wire to a
 * real backend later by swapping the data source in CatalogContext.
 */

export interface CatalogPrice {
  amount: number // cents
  currency_code: string
}

export interface CatalogVariant {
  id: string
  title: string
  prices: CatalogPrice[]
  inventory_quantity?: number
}

export interface CatalogImage {
  id: string
  url: string // remote URL or base64 data URL
}

/** A buyable sub-product belonging to a parent category. */
export interface CatalogProduct {
  id: string
  handle: string
  title: string
  description: string
  parentId: string
  thumbnail: string | null
  images: CatalogImage[]
  variants: CatalogVariant[]
  collection?: { title: string }
  createdAt: number
}

/** A parent category shown on the home page. */
export interface CatalogParent {
  id: string
  handle: string
  title: string
  description: string
  image: string | null
  createdAt: number
}

export interface Catalog {
  parents: CatalogParent[]
  products: CatalogProduct[]
}
