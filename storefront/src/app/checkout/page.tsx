"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useCart } from "@/context/CartContext"
import { useOrders } from "@/context/OrdersContext"
import { formatPrice } from "@/lib/utils"
import { SHIPPING_OPTIONS, shippingCost } from "@/lib/checkout"
import CheckoutSteps from "@/components/checkout/CheckoutSteps"
import OrderSummary from "@/components/checkout/OrderSummary"
import TrustBadges from "@/components/ui/TrustBadges"
import Button from "@/components/ui/Button"

const STEPS = ["Contact", "Shipping", "Delivery", "Payment", "Review"]

const inputCls =
  "w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
const labelCls = "block text-[10px] tracking-[0.25em] uppercase text-muted mb-2"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, itemCount, clearCart } = useCart()
  const { addOrder } = useOrders()

  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [placing, setPlacing] = useState(false)

  const [email, setEmail] = useState("")
  const [addr, setAddr] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    postal: "",
    country: "United States",
  })
  const [method, setMethod] = useState<"standard" | "express">("standard")
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" })

  const items = cart?.items ?? []
  const subtotal = items.reduce(
    (s: number, i: any) => s + i.unit_price * i.quantity,
    0
  )
  const shipping = shippingCost(method, subtotal)

  if (!cart || itemCount === 0) {
    return (
      <div className="pt-32 px-6 min-h-screen">
        <div className="max-w-2xl mx-auto text-center py-28">
          <p className="text-muted text-sm mb-8">Your cart is empty.</p>
          <Link
            href="/products"
            className="text-xs tracking-[0.25em] uppercase border border-border px-8 py-3 rounded-sm hover:border-accent hover:text-accent transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  function setField(patch: Partial<typeof addr>) {
    setAddr((a) => ({ ...a, ...patch }))
  }

  function validate(): boolean {
    setError("")
    if (step === 0) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setError("Enter a valid email address.")
        return false
      }
    }
    if (step === 1) {
      if (
        !addr.firstName.trim() ||
        !addr.lastName.trim() ||
        !addr.address1.trim() ||
        !addr.city.trim() ||
        !addr.postal.trim()
      ) {
        setError("Please complete all address fields.")
        return false
      }
    }
    if (step === 3) {
      const digits = card.number.replace(/\s/g, "")
      if (card.name.trim().length < 2) return setError("Enter the name on card."), false
      if (digits.length < 12) return setError("Enter a valid card number."), false
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(card.expiry)) return setError("Expiry must be MM/YY."), false
      if (!/^\d{3,4}$/.test(card.cvc)) return setError("Enter a valid CVC."), false
    }
    return true
  }

  function next() {
    if (!validate()) return
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }
  function back() {
    setError("")
    setStep((s) => Math.max(0, s - 1))
  }

  function placeOrder() {
    setPlacing(true)
    const order = addOrder({
      email,
      items: items.map((i: any) => ({
        title: i.title,
        variant: i.variant?.title,
        quantity: i.quantity,
        unit_price: i.unit_price,
        thumbnail: i.thumbnail,
      })),
      subtotal,
      shipping,
      total: subtotal + shipping,
      address: addr,
      shippingMethod: method,
    })
    clearCart()
    router.push(`/checkout/confirmation?order=${order.id}`)
  }

  return (
    <div className="pt-28 px-6 pb-28 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl font-semibold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          <div>
            <CheckoutSteps
              steps={STEPS}
              current={step}
              onStep={(i) => setStep(i)}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        className={inputCls}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                      <p className="text-[11px] text-muted mt-2">
                        Order confirmation and receipts are sent here. Guest
                        checkout — no account needed.
                      </p>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>First name</label>
                      <input
                        className={inputCls}
                        value={addr.firstName}
                        onChange={(e) => setField({ firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Last name</label>
                      <input
                        className={inputCls}
                        value={addr.lastName}
                        onChange={(e) => setField({ lastName: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Address</label>
                      <input
                        className={inputCls}
                        value={addr.address1}
                        onChange={(e) => setField({ address1: e.target.value })}
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>City</label>
                      <input
                        className={inputCls}
                        value={addr.city}
                        onChange={(e) => setField({ city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Postal code</label>
                      <input
                        className={inputCls}
                        value={addr.postal}
                        onChange={(e) => setField({ postal: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Country</label>
                      <input
                        className={inputCls}
                        value={addr.country}
                        onChange={(e) => setField({ country: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map((o) => {
                      const cost = shippingCost(o.id, subtotal)
                      return (
                        <button
                          key={o.id}
                          onClick={() => setMethod(o.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-lg border text-left transition-colors ${
                            method === o.id
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-fg"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                method === o.id ? "border-accent" : "border-muted"
                              }`}
                            >
                              {method === o.id && (
                                <span className="w-2 h-2 rounded-full bg-accent" />
                              )}
                            </span>
                            <span>
                              <span className="text-sm font-medium block">
                                {o.label}
                              </span>
                              <span className="text-xs text-muted">{o.eta}</span>
                            </span>
                          </span>
                          <span className="text-sm">
                            {cost === 0 ? "Free" : formatPrice(cost)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div className="glass rounded-lg p-3 text-[11px] text-muted">
                      Demo payment — no real charge. Use any values (Stripe
                      Elements drop in here for production).
                    </div>
                    <div>
                      <label className={labelCls}>Name on card</label>
                      <input
                        className={inputCls}
                        value={card.name}
                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Card number</label>
                      <input
                        className={inputCls}
                        value={card.number}
                        inputMode="numeric"
                        onChange={(e) =>
                          setCard({
                            ...card,
                            number: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16)
                              .replace(/(.{4})/g, "$1 ")
                              .trim(),
                          })
                        }
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Expiry</label>
                        <input
                          className={inputCls}
                          value={card.expiry}
                          onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>CVC</label>
                        <input
                          className={inputCls}
                          value={card.cvc}
                          inputMode="numeric"
                          onChange={(e) =>
                            setCard({
                              ...card,
                              cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                            })
                          }
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5 text-sm">
                    <ReviewRow label="Contact" value={email} onEdit={() => setStep(0)} />
                    <ReviewRow
                      label="Ship to"
                      value={`${addr.firstName} ${addr.lastName}, ${addr.address1}, ${addr.city} ${addr.postal}, ${addr.country}`}
                      onEdit={() => setStep(1)}
                    />
                    <ReviewRow
                      label="Delivery"
                      value={`${SHIPPING_OPTIONS.find((o) => o.id === method)?.label} — ${
                        shipping === 0 ? "Free" : formatPrice(shipping)
                      }`}
                      onEdit={() => setStep(2)}
                    />
                    <ReviewRow
                      label="Payment"
                      value={`•••• ${card.number.replace(/\s/g, "").slice(-4) || "····"}`}
                      onEdit={() => setStep(3)}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {error && <p className="text-sm text-red-400 mt-5">{error}</p>}

            <div className="flex items-center gap-3 mt-8">
              {step > 0 ? (
                <Button variant="outline" onClick={back}>
                  Back
                </Button>
              ) : (
                <Link href="/cart">
                  <Button variant="outline">Back to cart</Button>
                </Link>
              )}
              {step < STEPS.length - 1 ? (
                <Button variant="gradient" onClick={next}>
                  Continue
                </Button>
              ) : (
                <Button variant="gradient" onClick={placeOrder} disabled={placing}>
                  {placing ? "Placing order…" : `Place order · ${formatPrice(subtotal + shipping)}`}
                </Button>
              )}
            </div>

            <TrustBadges className="mt-10" />
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <OrderSummary items={items} subtotal={subtotal} shipping={shipping} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string
  value: string
  onEdit: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1">
          {label}
        </p>
        <p className="text-fg">{value}</p>
      </div>
      <button
        onClick={onEdit}
        className="text-[11px] tracking-widest uppercase text-accent hover:opacity-80 shrink-0"
      >
        Edit
      </button>
    </div>
  )
}
