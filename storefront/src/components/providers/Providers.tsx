"use client"

import { ReactNode } from "react"
import { CartProvider } from "@/context/CartContext"
import { CatalogProvider } from "@/context/CatalogContext"
import { AdminProvider } from "@/context/AdminContext"
import { ToastProvider } from "@/context/ToastContext"
import { UIProvider } from "@/context/UIContext"
import { ReviewsProvider } from "@/context/ReviewsContext"
import { OrdersProvider } from "@/context/OrdersContext"
import Toaster from "@/components/ui/Toaster"
import CartDrawer from "@/components/cart/CartDrawer"
import SearchOverlay from "@/components/search/SearchOverlay"

/**
 * Composes all client-side context providers and renders global overlays
 * (toaster, cart drawer). Extended per phase.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <CatalogProvider>
        <ReviewsProvider>
          <OrdersProvider>
            <ToastProvider>
              <UIProvider>
                <CartProvider>
                  {children}
                  <Toaster />
                  <CartDrawer />
                  <SearchOverlay />
                </CartProvider>
              </UIProvider>
            </ToastProvider>
          </OrdersProvider>
        </ReviewsProvider>
      </CatalogProvider>
    </AdminProvider>
  )
}
