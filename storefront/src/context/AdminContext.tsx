"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

/**
 * Demo admin auth. This is a CLIENT-SIDE gate for the local-first build — it
 * is NOT real security (the password is a public env var and the session is
 * just localStorage). When wiring the real Medusa backend, replace login()
 * with a call to the Medusa admin auth endpoint and store a real token.
 */

const ADMIN_SESSION_KEY = "admin_session"
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

interface AdminContextType {
  isAdmin: boolean
  ready: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setIsAdmin(window.localStorage.getItem(ADMIN_SESSION_KEY) === "1")
    setReady(true)
  }, [])

  function login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      window.localStorage.setItem(ADMIN_SESSION_KEY, "1")
      setIsAdmin(true)
      return true
    }
    return false
  }

  function logout() {
    window.localStorage.removeItem(ADMIN_SESSION_KEY)
    setIsAdmin(false)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, ready, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be inside AdminProvider")
  return ctx
}
