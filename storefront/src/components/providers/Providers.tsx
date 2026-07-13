"use client"

import { ReactNode } from "react"
import { CartProvider } from "@/context/CartContext"
import { CatalogProvider } from "@/context/CatalogContext"
import { AdminProvider } from "@/context/AdminContext"

/**
 * Composes all client-side context providers. New providers (Toast, Wishlist,
 * Orders, RecentlyViewed, Reviews) are nested here as later phases add them,
 * keeping layout.tsx clean.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <CatalogProvider>
        <CartProvider>{children}</CartProvider>
      </CatalogProvider>
    </AdminProvider>
  )
}
