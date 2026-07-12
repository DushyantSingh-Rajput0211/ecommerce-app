"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { LayoutGrid, PackagePlus, FolderPlus, LogOut, Store } from "lucide-react"
import { useAdmin } from "@/context/AdminContext"
import Spinner from "@/components/ui/Spinner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin, ready, logout } = useAdmin()

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (ready && !isAdmin && !isLoginPage) {
      router.replace("/admin/login")
    }
  }, [ready, isAdmin, isLoginPage, router])

  // The login page renders outside the guarded chrome.
  if (isLoginPage) {
    return <div className="pt-16 min-h-screen">{children}</div>
  }

  if (!ready || !isAdmin) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    )
  }

  const navLink =
    "inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-muted hover:text-fg transition-colors"

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-border glass sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-[11px] tracking-[0.3em] uppercase font-medium">
              Admin
            </span>
            <Link href="/admin" className={navLink}>
              <LayoutGrid size={14} /> Dashboard
            </Link>
            <Link href="/admin/products/new" className={navLink}>
              <PackagePlus size={14} /> Product
            </Link>
            <Link href="/admin/parents/new" className={navLink}>
              <FolderPlus size={14} /> Category
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className={navLink}>
              <Store size={14} /> View store
            </Link>
            <button onClick={logout} className={navLink}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
    </div>
  )
}
