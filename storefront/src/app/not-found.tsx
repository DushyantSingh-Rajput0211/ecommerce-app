import Link from "next/link"
import GradientText from "@/components/ui/GradientText"

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p
          className="font-display font-semibold leading-none text-gradient"
          style={{ fontSize: "clamp(5rem, 20vw, 12rem)" }}
        >
          404
        </p>
        <h1 className="font-display text-2xl font-semibold mt-4 mb-3">
          <GradientText>Lost</GradientText> in space
        </h1>
        <p className="text-sm text-muted max-w-sm mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="text-xs tracking-[0.25em] uppercase bg-[image:var(--grad-primary)] bg-[length:200%_200%] text-white px-8 py-3.5 rounded-sm hover:bg-[position:100%_50%] transition-all"
          >
            Go home
          </Link>
          <Link
            href="/products"
            className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3.5 rounded-sm hover:border-accent hover:text-accent transition-colors"
          >
            Shop all
          </Link>
        </div>
      </div>
    </div>
  )
}
