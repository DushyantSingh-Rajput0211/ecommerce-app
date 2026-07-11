/** Format a price from cents to a display string. Example: 4999 -> "$49.99" */
export function formatPrice(amount: number, currency: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100)
}

/**
 * Race a promise against a timeout so a slow/hanging backend never blocks
 * server rendering. Rejects with a "timeout" error if `ms` elapses first.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number = 3000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ])
}

/** Get the lowest price across all variants of a product (in cents), or null. */
export function getLowestPrice(product: any): number | null {
  const allPrices = product.variants
    ?.flatMap((v: any) => v.prices ?? [])
    .map((p: any) => p.amount)
    .filter((a: any) => typeof a === "number")

  if (!allPrices?.length) return null
  return Math.min(...allPrices)
}
