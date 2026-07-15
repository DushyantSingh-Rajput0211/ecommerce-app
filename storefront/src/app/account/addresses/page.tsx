"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/context/ToastContext"
import Button from "@/components/ui/Button"

const STORAGE_KEY = "account_address_v1"

const EMPTY = {
  firstName: "",
  lastName: "",
  address1: "",
  city: "",
  postal: "",
  country: "United States",
}

export default function AccountAddresses() {
  const { toast } = useToast()
  const [addr, setAddr] = useState(EMPTY)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setAddr(JSON.parse(raw))
        setSaved(true)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const inputCls =
    "w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
  const labelCls =
    "block text-[10px] tracking-[0.25em] uppercase text-muted mb-2"

  function set(patch: Partial<typeof addr>) {
    setAddr((a) => ({ ...a, ...patch }))
  }

  function save(e: React.FormEvent) {
    e.preventDefault()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(addr))
    setSaved(true)
    toast("Address saved")
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Addresses</h1>
      <p className="text-sm text-muted mb-8">
        {saved ? "Your default shipping address." : "Add a shipping address."}
      </p>
      <form onSubmit={save} className="max-w-lg grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>First name</label>
          <input
            className={inputCls}
            value={addr.firstName}
            onChange={(e) => set({ firstName: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>Last name</label>
          <input
            className={inputCls}
            value={addr.lastName}
            onChange={(e) => set({ lastName: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Address</label>
          <input
            className={inputCls}
            value={addr.address1}
            onChange={(e) => set({ address1: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>City</label>
          <input
            className={inputCls}
            value={addr.city}
            onChange={(e) => set({ city: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>Postal code</label>
          <input
            className={inputCls}
            value={addr.postal}
            onChange={(e) => set({ postal: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Country</label>
          <input
            className={inputCls}
            value={addr.country}
            onChange={(e) => set({ country: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <Button type="submit" variant="gradient">
            Save address
          </Button>
        </div>
      </form>
    </div>
  )
}
