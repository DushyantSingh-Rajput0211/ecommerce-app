"use client"

import { useState } from "react"
import { useAccount } from "@/context/AccountContext"
import { useToast } from "@/context/ToastContext"
import Button from "@/components/ui/Button"

export default function AccountProfile() {
  const { user, updateProfile } = useAccount()
  const { toast } = useToast()
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")

  const inputCls =
    "w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"

  function save(e: React.FormEvent) {
    e.preventDefault()
    updateProfile({ name: name.trim(), email: email.trim() })
    toast("Profile updated")
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-8">Profile</h1>
      <form onSubmit={save} className="max-w-md space-y-5">
        <div>
          <label className="block text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
            Name
          </label>
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
            Email
          </label>
          <input
            type="email"
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" variant="gradient">
          Save changes
        </Button>
      </form>
    </div>
  )
}
