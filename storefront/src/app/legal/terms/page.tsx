import type { Metadata } from "next"

export const metadata: Metadata = { title: "Terms of Service" }

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="text-xs uppercase tracking-widest text-accent">
        Template — replace with your finalized terms before launch.
      </p>

      <h2>Orders</h2>
      <p>
        By placing an order with GaSmart you confirm the information you provide
        is accurate. All orders are subject to availability and acceptance.
        Prices and product details may change without notice.
      </p>

      <h2>Payment</h2>
      <p>
        Payment is processed securely through our payment provider. We accept
        major cards, Apple Pay, Google Pay, and cash on delivery where
        available.
      </p>

      <h2>Shipping</h2>
      <p>
        Delivery times are estimates. Title and risk of loss pass to you upon
        delivery to the carrier.
      </p>

      <h2>Liability</h2>
      <p>
        GaSmart is not liable for indirect or consequential damages to the
        extent permitted by law.
      </p>

      <h2>Contact</h2>
      <p>Questions? Email [support@gasmart.com].</p>
    </>
  )
}
