import { Suspense } from "react"
import Confirmation from "@/components/checkout/Confirmation"
import Spinner from "@/components/ui/Spinner"

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 min-h-screen flex justify-center">
          <Spinner className="w-6 h-6" />
        </div>
      }
    >
      <Confirmation />
    </Suspense>
  )
}
