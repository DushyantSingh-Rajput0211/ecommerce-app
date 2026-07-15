"use client"

import { ReactNode } from "react"
import { CartProvider } from "@/context/CartContext"
import { CatalogProvider } from "@/context/CatalogContext"
import { AdminProvider } from "@/context/AdminContext"
import { ToastProvider } from "@/context/ToastContext"
import { UIProvider } from "@/context/UIContext"
import { ReviewsProvider } from "@/context/ReviewsContext"
import { OrdersProvider } from "@/context/OrdersContext"
import { AccountProvider } from "@/context/AccountContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext"
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
      <AccountProvider>
        <CatalogProvider>
          <ReviewsProvider>
            <OrdersProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
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
                </RecentlyViewedProvider>
              </WishlistProvider>
            </OrdersProvider>
          </ReviewsProvider>
        </CatalogProvider>
      </AccountProvider>
    </AdminProvider>
  )
}
