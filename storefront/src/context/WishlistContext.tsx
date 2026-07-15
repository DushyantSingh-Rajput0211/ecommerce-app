"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"

interface WishlistContextType {
  handles: string[]
  has: (handle: string) => boolean
  toggle: (handle: string) => void
  remove: (handle: string) => void
  count: number
}

const WishlistContext = createContext<WishlistContextType | null>(null)

const STORAGE_KEY = "wishlist_v1"

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [handles, setHandles] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setHandles(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  const persist = useCallback((next: string[]) => {
    setHandles(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }, [])

  const has = useCallback((handle: string) => handles.includes(handle), [handles])
  const toggle = useCallback(
    (handle: string) =>
      persist(
        handles.includes(handle)
          ? handles.filter((h) => h !== handle)
          : [handle, ...handles]
      ),
    [handles, persist]
  )
  const remove = useCallback(
    (handle: string) => persist(handles.filter((h) => h !== handle)),
    [handles, persist]
  )

  return (
    <WishlistContext.Provider
      value={{ handles, has, toggle, remove, count: handles.length }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider")
  return ctx
}
