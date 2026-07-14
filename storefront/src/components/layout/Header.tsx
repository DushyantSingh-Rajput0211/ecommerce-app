"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import { useCatalog } from "@/context/CatalogContext"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
]

export default function Header() {
  const { itemCount } = useCart()
  const { openCart } = useUI()
  const { parents } = useCatalog()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border glass">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Left: mobile menu button + wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden -ml-1 w-9 h-9 flex items-center justify-center text-fg hover:text-accent transition-colors"
          >
            <Menu size={20} />
          </button>
          <Link
            href="/"
            className="text-xs font-medium tracking-[0.3em] uppercase"
          >
            My Store
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs tracking-widest uppercase text-muted hover:text-fg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: cart */}
        <button
          onClick={openCart}
          aria-label="Open cart"
          className="relative w-9 h-9 flex items-center justify-center hover:text-accent transition-colors"
        >
          <ShoppingBag size={18} />
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", damping: 18, stiffness: 400 }}
                className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[image:var(--grad-primary)] text-white text-[10px] font-medium flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-bg md:hidden flex flex-col"
          >
            <div className="h-16 px-6 flex items-center justify-between border-b border-border">
              <span className="text-xs font-medium tracking-[0.3em] uppercase">
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center text-fg hover:text-accent transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="flex-1 px-6 py-10 flex flex-col gap-1"
            >
              {NAV.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-3xl font-semibold py-2 block hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {parents.length > 0 && (
                <p className="text-[10px] tracking-[0.35em] uppercase text-muted mt-8 mb-2">
                  Categories
                </p>
              )}
              {parents.map((p) => (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={`/category/${p.handle}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm tracking-widest uppercase text-muted hover:text-fg transition-colors py-1.5 block"
                  >
                    {p.title}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
