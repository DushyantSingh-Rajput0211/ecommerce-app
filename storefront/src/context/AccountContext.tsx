"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"

export interface Account {
  name: string
  email: string
}

interface AccountContextType {
  user: Account | null
  ready: boolean
  signIn: (account: Account) => void
  signOut: () => void
  updateProfile: (patch: Partial<Account>) => void
}

const AccountContext = createContext<AccountContextType | null>(null)

const STORAGE_KEY = "account_session_v1"

/**
 * Mock customer session (local-first). Not real auth — replace signIn with a
 * Medusa customer auth call and store a real token when wiring the backend.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  const persist = useCallback((next: Account | null) => {
    setUser(next)
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  const signIn = useCallback((account: Account) => persist(account), [persist])
  const signOut = useCallback(() => persist(null), [persist])
  const updateProfile = useCallback(
    (patch: Partial<Account>) =>
      setUser((u) => {
        if (!u) return u
        const next = { ...u, ...patch }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      }),
    []
  )

  return (
    <AccountContext.Provider
      value={{ user, ready, signIn, signOut, updateProfile }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error("useAccount must be inside AccountProvider")
  return ctx
}
