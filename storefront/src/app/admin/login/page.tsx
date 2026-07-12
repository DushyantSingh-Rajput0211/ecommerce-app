"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { useAdmin } from "@/context/AdminContext"
import Button from "@/components/ui/Button"
import GradientText from "@/components/ui/GradientText"

export default function AdminLoginPage() {
  const router = useRouter()
  const { isAdmin, ready, login } = useAdmin()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (ready && isAdmin) router.replace("/admin")
  }, [ready, isAdmin, router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (login(password)) {
      router.replace("/admin")
    } else {
      setError("Incorrect password.")
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="glass rounded-2xl p-8">
          <div className="w-11 h-11 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mb-6">
            <Lock size={18} className="text-accent" />
          </div>
          <h1 className="font-display text-2xl font-semibold mb-1">
            Admin <GradientText>access</GradientText>
          </h1>
          <p className="text-sm text-muted mb-7">
            Sign in to manage the catalog.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
                Password
              </label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" variant="gradient" className="w-full">
              Sign in
            </Button>
          </form>

          <p className="text-[11px] text-muted mt-6 leading-relaxed">
            Demo access — default password{" "}
            <code className="text-fg/80">admin123</code> (set{" "}
            <code className="text-fg/80">NEXT_PUBLIC_ADMIN_PASSWORD</code> to
            change). This is a local demo gate, not real authentication.
          </p>
        </div>
      </div>
    </div>
  )
}
