/** Shared checkout constants + helpers (prices in cents). */

export const FREE_SHIPPING_THRESHOLD = 15000 // $150

export interface ShippingOption {
  id: "standard" | "express"
  label: string
  eta: string
  price: number // cents
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "standard", label: "Standard", eta: "3–5 business days", price: 990 },
  { id: "express", label: "Express", eta: "1–2 business days", price: 1990 },
]

/** Standard shipping is free once the subtotal clears the threshold. */
export function shippingCost(
  method: ShippingOption["id"],
  subtotal: number
): number {
  const option = SHIPPING_OPTIONS.find((o) => o.id === method)
  if (!option) return 0
  if (method === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  return option.price
}

/** Amount still needed to unlock free standard shipping (0 if already free). */
export function amountToFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
}
