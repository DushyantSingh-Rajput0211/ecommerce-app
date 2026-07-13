"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useCatalog } from "@/context/CatalogContext"
import { fadeUp, stagger } from "@/lib/motion"

/** Home-page "Shop by category" grid — the 4 parent categories. */
export default function ParentGrid() {
  const { parents, getProductsByParent } = useCatalog()

  if (parents.length === 0) return null

  return (
    <section className="px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-accent mb-2">
              Collections
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Shop by category
            </h2>
          </div>
        </div>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
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
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="w-full h-full bg-card" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-display text-xl font-semibold group-hover:text-accent transition-colors">
                      {parent.title}
                    </p>
                    <p className="text-[11px] text-fg/60 tracking-widest uppercase mt-1">
                      {count} item{count === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
