"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"

export interface OrderItem {
  title: string
  variant?: string
  quantity: number
  unit_price: number
  thumbnail?: string | null
}

export interface Order {
  id: string
  email: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  address: {
    firstName: string
    lastName: string
    address1: string
    city: string
    postal: string
    country: string
  }
  shippingMethod: string
  createdAt: number
}

interface OrdersContextType {
  orders: Order[]
  ready: boolean
  addOrder: (order: Omit<Order, "id" | "createdAt">) => Order
  getOrder: (id: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextType | null>(null)

const STORAGE_KEY = "orders_v1"
let orderCounter = 1000

function makeOrderId() {
  orderCounter += 1
  return `MS-${orderCounter}`
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: Order[] = JSON.parse(raw)
        setOrders(parsed)
        // Keep ids monotonic across reloads.
        const max = parsed.reduce((m, o) => {
          const n = parseInt(o.id.replace(/\D/g, ""), 10)
          return isNaN(n) ? m : Math.max(m, n)
        }, orderCounter)
        orderCounter = max
      }
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  const addOrder = useCallback(
    (order: Omit<Order, "id" | "createdAt">) => {
      const full: Order = {
        ...order,
        id: makeOrderId(),
        createdAt: orderCounter,
      }
      setOrders((prev) => {
        const next = [full, ...prev]
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          /* ignore quota */
        }
        return next
      })
      return full
    },
    []
  )

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  )

  return (
    <OrdersContext.Provider value={{ orders, ready, addOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be inside OrdersProvider")
  return ctx
}
