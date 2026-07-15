"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react"

interface UIContextType {
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
  searchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
}

const UIContext = createContext<UIContextType | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  return (
    <UIContext.Provider
      value={{
        cartOpen,
        openCart,
        closeCart,
        searchOpen,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error("useUI must be inside UIProvider")
  return ctx
}
