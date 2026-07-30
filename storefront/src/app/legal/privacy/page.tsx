import type { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-xs uppercase tracking-widest text-accent">
        Template — replace with your finalized policy before launch.
      </p>

      <h2>What we collect</h2>
      <p>
        When you shop with GaSmart we collect the information needed to process
        your order: your name, email address, shipping address, and order
        details. Payment card details are handled by our payment processor and
        are never stored on our servers.
      </p>

      <h2>How we use it</h2>
      <p>
        We use your information to process and ship orders, send order
        confirmations and support responses, and improve the store. We do not
        sell your personal data.
      </p>

      <h2>Third parties</h2>
      <p>
        We share data only with the services required to run the store — our
        payment processor (for charges), email provider (for confirmations), and
        hosting/infrastructure providers.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request access to, correction of, or deletion of your personal
        data at any time by contacting us at [support@gasmart.com].
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy? Email [support@gasmart.com].</p>
    </>
  )
}
