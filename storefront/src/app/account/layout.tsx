"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  LayoutGrid,
  Package,
  Heart,
  MapPin,
  UserRound,
  LogOut,
} from "lucide-react"
import { useAccount } from "@/context/AccountContext"
import Spinner from "@/components/ui/Spinner"

const NAV = [
  { href: "/account", label: "Overview", icon: LayoutGrid },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/profile", label: "Profile", icon: UserRound },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, ready, signOut } = useAccount()
  const isLoginPage = pathname === "/account/login"

  useEffect(() => {
    if (ready && !user && !isLoginPage) router.replace("/account/login")
  }, [ready, user, isLoginPage, router])

  if (isLoginPage) return <div className="pt-16 min-h-screen">{children}</div>

  if (!ready || !user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    )
  }

  return (
    <div className="pt-28 px-6 pb-28 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <aside className="lg:sticky lg:top-24 h-fit">
          <p className="font-display text-xl font-semibold mb-1">
            {user.name || "Account"}
          </p>
          <p className="text-xs text-muted mb-6 truncate">{user.email}</p>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/account" && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-white/5 text-fg"
                      : "text-muted hover:text-fg hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} /> {label}
                </Link>
              )
            })}
            <button
              onClick={() => {
                signOut()
                router.push("/")
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted hover:text-fg hover:bg-white/5 transition-colors mt-2"
            >
              <LogOut size={16} /> Sign out
            </button>
          </nav>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  )
}
