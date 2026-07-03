"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { sdk } from "@/lib/medusa"

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedId = localStorage.getItem("cart_id")
    if (!savedId) return
    setCartId(savedId)
    sdk.store.cart
      .retrieve(savedId)
      .then(({ cart }) => setCart(cart))
      .catch(() => {
        localStorage.removeItem("cart_id")
        setCartId(null)
      })
  }, [])

  async function getOrCreateCart(): Promise<string> {
    if (cartId) return cartId
    const { cart } = await sdk.store.cart.create({})
    localStorage.setItem("cart_id", cart.id)
    setCart(cart)
    setCartId(cart.id)
    return cart.id
  }

  async function addToCart(variantId: string, quantity = 1) {
    setIsLoading(true)
    try {
      const id = await getOrCreateCart()
      const { cart: updated } = await sdk.store.cart.createLineItem(id, {
        variant_id: variantId,
        quantity,
      })
      setCart(updated)
    } finally {
      setIsLoading(false)
    }
  }

  async function removeFromCart(lineItemId: string) {
    if (!cartId) return
    const { cart: updated } = await sdk.store.cart.deleteLineItem(
      cartId,
      lineItemId
    )
    setCart(updated)
  }

  async function updateQuantity(lineItemId: string, quantity: number) {
    if (!cartId) return
    if (quantity < 1) {
      return removeFromCart(lineItemId)
    }
    const { cart: updated } = await sdk.store.cart.updateLineItem(
      cartId,
      lineItemId,
      { quantity }
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
