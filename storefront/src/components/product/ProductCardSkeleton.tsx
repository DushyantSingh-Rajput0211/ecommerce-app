/** Placeholder card matching ProductCard's dimensions, with a shimmer sweep. */
export default function ProductCardSkeleton() {
  return (
    <div className="block">
      <div className="aspect-3/4 rounded-lg skeleton mb-3" />
      <div className="h-3.5 w-3/4 rounded skeleton" />
      <div className="h-3.5 w-1/3 rounded skeleton mt-2" />
    </div>
  )
}
