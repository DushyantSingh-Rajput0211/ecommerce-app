import Link from "next/link"

export interface Crumb {
  label: string
  href?: string
}

/** Minimal breadcrumb trail. The last crumb (no href) renders as current. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-[11px] tracking-widest uppercase text-muted"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="hover:text-fg transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-fg" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
