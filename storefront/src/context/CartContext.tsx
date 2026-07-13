"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { sdk } from "@/lib/medusa"
import { useCatalog } from "@/context/CatalogContext"
import { withTimeout } from "@/lib/utils"

interface CartContextType {
  cart: any
  cartId: string | null
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  removeFromCart: (lineItemId: string) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  itemCount: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | null>(null)

const LOCAL_CART_KEY = "mock_cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog()
  const [cart, setCart] = useState<any>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /** Find a catalog product + variant by variant id (for the local cart). */
  function findCatalogVariant(variantId: string) {
    for (const product of products) {
      const variant = product.variants?.find((v: any) => v.id === variantId)
      if (variant) return { product, variant }
    }
    return null
  }

  // Restore cart on load: prefer a saved local (mock) cart, else a real one.
  useEffect(() => {
    const localRaw = localStorage.getItem(LOCAL_CART_KEY)
    if (localRaw) {
      try {
        setCart(JSON.parse(localRaw))
        return
      } catch {
        localStorage.removeItem(LOCAL_CART_KEY)
      }
    }

    const savedId = localStorage.getItem("cart_id")
    if (!savedId) return
    setCartId(savedId)
    withTimeout(sdk.store.cart.retrieve(savedId))
      .then(({ cart }) => setCart(cart))
      .catch(() => {
        localStorage.removeItem("cart_id")
        setCartId(null)
      })
  }, [])

  function persistLocal(next: any) {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(next))
  }

  function isLocal(lineItemId?: string) {
    return cart?.__local || lineItemId?.startsWith("li_")
  }

  async function getOrCreateCart(): Promise<string> {
    if (cartId) return cartId
    const { cart } = await withTimeout(sdk.store.cart.create({}))
    localStorage.setItem("cart_id", cart.id)
    setCart(cart)
    setCartId(cart.id)
    return cart.id
  }

  async function addToCart(variantId: string, quantity = 1) {
    // Catalog products are local-first — keep a fully local cart for them.
    const mock = findCatalogVariant(variantId)
    if (mock) {
      setIsLoading(true)
      try {
        setCart((prev: any) => {
          const base =
            prev?.__local ? prev : { id: "local", __local: true, items: [] }
          const items = (base.items ?? []).map((i: any) => ({ ...i }))
          const liId = `li_${variantId}`
          const idx = items.findIndex((i: any) => i.id === liId)
          if (idx >= 0) {
            items[idx].quantity += quantity
          } else {
            items.push({
              id: liId,
              variant_id: variantId,
              title: mock.product.title,
              thumbnail: mock.product.thumbnail,
              quantity,
              unit_price: mock.variant.prices?.[0]?.amount ?? 0,
              variant: { title: mock.variant.title },
            })
          }
          const next = { ...base, items }
          persistLocal(next)
          return next
        })
      } finally {
        setIsLoading(false)
      }
      return
    }

    setIsLoading(true)
    try {
      const id = await getOrCreateCart()
      const { cart: updated } = await withTimeout(
        sdk.store.cart.createLineItem(id, {
          variant_id: variantId,
          quantity,
        })
      )
      setCart(updated)
    } finally {
      setIsLoading(false)
    }
  }

  async function removeFromCart(lineItemId: string) {
    if (isLocal(lineItemId)) {
      setCart((prev: any) => {
        const items = (prev?.items ?? []).filter(
          (i: any) => i.id !== lineItemId
        )
        const next = { ...prev, items }
        persistLocal(next)
        return next
      })
      return
    }
    if (!cartId) return
    const { cart: updated } = await withTimeout(
      sdk.store.cart.deleteLineItem(cartId, lineItemId)
    )
    setCart(updated)
  }

  async function updateQuantity(lineItemId: string, quantity: number) {
    if (isLocal(lineItemId)) {
      if (quantity < 1) return removeFromCart(lineItemId)
      setCart((prev: any) => {
        const items = (prev?.items ?? []).map((i: any) =>
          i.id === lineItemId ? { ...i, quantity } : i
        )
        const next = { ...prev, items }
        persistLocal(next)
        return next
      })
      return
    }
    if (!cartId) return
    if (quantity < 1) {
      return removeFromCart(lineItemId)
    }
    const { cart: updated } = await withTimeout(
      sdk.store.cart.updateLineItem(cartId, lineItemId, { quantity })
    )
    setCart(updated)
  }

  const itemCount =
    cart?.items?.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    ) ?? 0

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        addToCart,
        removeFromCart,
        updateQuantity,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be inside CartProvider")
  return ctx
}
