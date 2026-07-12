import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border py-16 mt-24">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-start">
        <p className="text-xs tracking-[0.3em] uppercase">My Store</p>
        <div className="flex gap-10 text-xs text-muted">
          <Link href="/products" className="hover:text-fg transition-colors">Shop</Link>
          <Link href="#" className="hover:text-fg transition-colors">Returns</Link>
          <Link href="#" className="hover:text-fg transition-colors">Contact</Link>
          <Link href="/admin" className="hover:text-accent transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
