"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"

interface RecentlyViewedContextType {
  handles: string[]
  record: (handle: string) => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(
  null
)

const STORAGE_KEY = "recently_viewed_v1"
const MAX = 8

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [handles, setHandles] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setHandles(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  const record = useCallback((handle: string) => {
    setHandles((prev) => {
      const next = [handle, ...prev.filter((h) => h !== handle)].slice(0, MAX)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  return (
    <RecentlyViewedContext.Provider value={{ handles, record }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx)
    throw new Error(
      "useRecentlyViewed must be inside RecentlyViewedProvider"
    )
  return ctx
}
