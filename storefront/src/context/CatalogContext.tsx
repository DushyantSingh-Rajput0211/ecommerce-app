"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react"
import type {
  Catalog,
  CatalogParent,
  CatalogProduct,
} from "@/types/catalog"
import {
  defaultCatalog,
  loadCatalog,
  saveCatalog,
} from "@/lib/catalog"

interface CatalogContextType {
  parents: CatalogParent[]
  products: CatalogProduct[]
  ready: boolean // true once localStorage has hydrated on the client
  // reads
  getParentByHandle: (handle: string) => CatalogParent | undefined
  getProductByHandle: (handle: string) => CatalogProduct | undefined
  getProductById: (id: string) => CatalogProduct | undefined
  getProductsByParent: (parentId: string) => CatalogProduct[]
  // writes
  upsertParent: (parent: CatalogParent) => void
  deleteParent: (id: string) => void
  upsertProduct: (product: CatalogProduct) => void
  deleteProduct: (id: string) => void
  resetCatalog: () => void
}

const CatalogContext = createContext<CatalogContextType | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  // Initialize with the deterministic seed so SSR and first client render match.
  const [catalog, setCatalog] = useState<Catalog>(() => defaultCatalog())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setCatalog(loadCatalog())
    setReady(true)
  }, [])

  const persist = useCallback((next: Catalog) => {
    setCatalog(next)
    saveCatalog(next)
  }, [])

  const getParentByHandle = useCallback(
    (handle: string) => catalog.parents.find((p) => p.handle === handle),
    [catalog]
  )
  const getProductByHandle = useCallback(
    (handle: string) => catalog.products.find((p) => p.handle === handle),
    [catalog]
  )
  const getProductById = useCallback(
    (id: string) => catalog.products.find((p) => p.id === id),
    [catalog]
  )
  const getProductsByParent = useCallback(
    (parentId: string) =>
      catalog.products.filter((p) => p.parentId === parentId),
    [catalog]
  )

  const upsertParent = useCallback(
    (parent: CatalogParent) => {
      const exists = catalog.parents.some((p) => p.id === parent.id)
      const parents = exists
        ? catalog.parents.map((p) => (p.id === parent.id ? parent : p))
        : [...catalog.parents, parent]
      persist({ ...catalog, parents })
    },
    [catalog, persist]
  )

  const deleteParent = useCallback(
    (id: string) => {
      persist({
        parents: catalog.parents.filter((p) => p.id !== id),
        // Remove orphaned products in that parent too.
        products: catalog.products.filter((p) => p.parentId !== id),
      })
    },
    [catalog, persist]
  )

  const upsertProduct = useCallback(
    (product: CatalogProduct) => {
      const exists = catalog.products.some((p) => p.id === product.id)
      const products = exists
        ? catalog.products.map((p) => (p.id === product.id ? product : p))
        : [...catalog.products, product]
      persist({ ...catalog, products })
    },
    [catalog, persist]
  )

  const deleteProduct = useCallback(
    (id: string) => {
      persist({
        ...catalog,
        products: catalog.products.filter((p) => p.id !== id),
      })
    },
    [catalog, persist]
  )

  const resetCatalog = useCallback(() => persist(defaultCatalog()), [persist])

  return (
    <CatalogContext.Provider
      value={{
        parents: catalog.parents,
        products: catalog.products,
        ready,
        getParentByHandle,
        getProductByHandle,
        getProductById,
        getProductsByParent,
        upsertParent,
        deleteParent,
        upsertProduct,
        deleteProduct,
        resetCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error("useCatalog must be inside CatalogProvider")
  return ctx
}
