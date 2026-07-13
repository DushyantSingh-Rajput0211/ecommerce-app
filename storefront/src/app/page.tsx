import Link from "next/link"
import GradientText from "@/components/ui/GradientText"
import Reveal from "@/components/ui/Reveal"
import ParentGrid from "@/components/catalog/ParentGrid"
import FeaturedProducts from "@/components/catalog/FeaturedProducts"

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="min-h-[88vh] flex flex-col justify-end pb-14 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-6">
              Autumn / Winter 2026
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              className="font-display leading-[0.9] font-semibold"
              style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
            >
              New season,
              <br />
              <GradientText>redefined.</GradientText>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mt-10">
              <p className="text-muted text-sm max-w-xs leading-relaxed">
                Limited quantities. Shipped worldwide. Designed to stand out.
              </p>
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase
                  bg-[image:var(--grad-primary)] bg-[length:200%_200%] text-white px-8 py-4 rounded-sm
                  shadow-[0_8px_30px_-8px_rgba(124,58,237,0.6)] transition-all duration-300
                  hover:bg-[position:100%_50%] hover:shadow-[0_12px_44px_-6px_rgba(124,58,237,0.85)]"
              >
                Shop all
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 parent categories */}
      <ParentGrid />

      {/* Featured products */}
      <FeaturedProducts limit={4} />
    </div>
  )
}
