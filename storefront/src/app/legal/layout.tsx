import Link from "next/link"

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="pt-32 px-6 pb-28 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <nav className="text-[11px] tracking-widest uppercase text-muted mb-8">
          <Link href="/" className="hover:text-fg transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fg">Legal</span>
        </nav>
        <article className="prose-invert space-y-4 text-sm text-muted leading-relaxed [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-fg [&_h1]:mb-3 [&_h2]:text-fg [&_h2]:font-medium [&_h2]:text-base [&_h2]:mt-8 [&_h2]:mb-2">
          {children}
        </article>
      </div>
    </div>
  )
}
