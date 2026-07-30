import type { Metadata } from "next"

export const metadata: Metadata = { title: "Returns & Refunds" }

export default function ReturnsPage() {
  return (
    <>
      <h1>Returns &amp; Refunds</h1>
      <p className="text-xs uppercase tracking-widest text-accent">
        Template — replace with your finalized policy before launch.
      </p>

      <h2>30-day returns</h2>
      <p>
        You can return most items within 30 days of delivery for a refund or
        exchange, provided they&apos;re unused and in original packaging.
      </p>

      <h2>How to start a return</h2>
      <p>
        Email [support@gasmart.com] with your order number (e.g. GS-1001) and the
        item(s) you&apos;d like to return. We&apos;ll send return instructions.
      </p>

      <h2>Refunds</h2>
      <p>
        Once we receive and inspect your return, refunds are issued to your
        original payment method within 5–10 business days.
      </p>

      <h2>Exceptions</h2>
      <p>
        Final-sale items and used goods may not be eligible. See product pages
        for details.
      </p>

      <h2>Contact</h2>
      <p>Need help? Email [support@gasmart.com].</p>
    </>
  )
}
