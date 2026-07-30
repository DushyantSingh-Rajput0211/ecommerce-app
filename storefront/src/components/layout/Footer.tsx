import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border py-16 mt-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-6 justify-between items-start">
        <p className="text-xs tracking-[0.3em] uppercase">GaSmart</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs text-muted">
          <Link href="/products" className="hover:text-fg transition-colors">Shop</Link>
          <Link href="/collections" className="hover:text-fg transition-colors">Collections</Link>
          <Link href="/legal/returns" className="hover:text-fg transition-colors">Returns</Link>
          <Link href="/legal/privacy" className="hover:text-fg transition-colors">Privacy</Link>
          <Link href="/legal/terms" className="hover:text-fg transition-colors">Terms</Link>
          <Link href="/admin" className="hover:text-accent transition-colors">Admin</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8 text-[11px] text-muted">
        © {new Date().getFullYear()} GaSmart. All rights reserved.
      </div>
    </footer>
  )
}
