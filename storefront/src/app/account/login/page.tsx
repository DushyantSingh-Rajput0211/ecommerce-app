"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserRound } from "lucide-react"
import { useAccount } from "@/context/AccountContext"
import Button from "@/components/ui/Button"
import GradientText from "@/components/ui/GradientText"

export default function AccountLoginPage() {
  const router = useRouter()
  const { user, ready, signIn } = useAccount()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (ready && user) router.replace("/account")
  }, [ready, user, router])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return setError("Enter a valid email.")
    signIn({ name: name.trim() || email.split("@")[0], email })
    router.replace("/account")
  }

  const inputCls =
    "w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm glass rounded-2xl p-8">
        <div className="w-11 h-11 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mb-6">
          <UserRound size={18} className="text-accent" />
        </div>
        <h1 className="font-display text-2xl font-semibold mb-1">
          Your <GradientText>account</GradientText>
        </h1>
        <p className="text-sm text-muted mb-7">
          Sign in to view orders and your wishlist.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
              Name
            </label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
              Email
            </label>
            <input
              type="email"
              autoFocus
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" variant="gradient" className="w-full">
            Continue
          </Button>
        </form>
        <p className="text-[11px] text-muted mt-6 leading-relaxed">
          Demo sign-in — no password. Session is stored locally; swap for Medusa
          customer auth to go live.
        </p>
      </div>
    </div>
  )
}
