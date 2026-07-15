"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useCatalog } from "@/context/CatalogContext"
import { fadeUp, stagger } from "@/lib/motion"
import Breadcrumbs from "@/components/ui/Breadcrumbs"

export default function CollectionsPage() {
  const { parents, getProductsByParent } = useCatalog()

  return (
    <div className="pt-32 px-6 pb-28 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Collections" }]}
        />
        <div className="mt-6 mb-12 max-w-2xl">
          <h1 className="font-display text-4xl font-semibold mb-3">
            Collections
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Browse the full range by category.
          </p>
        </div>

        {parents.length === 0 ? (
          <p className="text-muted text-sm text-center py-24">
            No collections yet.
          </p>
        ) : (
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {parents.map((parent) => {
              const count = getProductsByParent(parent.id).length
              return (
                <motion.div key={parent.id} variants={fadeUp}>
                  <Link
                    href={`/category/${parent.handle}`}
                    className="group block relative aspect-4/5 rounded-xl overflow-hidden border border-border glow-hover"
                  >
                    {parent.image ? (
                      <Image
                        src={parent.image}
                        alt={parent.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="w-full h-full bg-card" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="font-display text-2xl font-semibold group-hover:text-accent transition-colors">
                        {parent.title}
                      </p>
                      {parent.description && (
                        <p className="text-xs text-fg/60 mt-1 line-clamp-2 max-w-xs">
                          {parent.description}
                        </p>
                      )}
                      <p className="text-[11px] text-fg/50 tracking-widest uppercase mt-2">
                        {count} item{count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
