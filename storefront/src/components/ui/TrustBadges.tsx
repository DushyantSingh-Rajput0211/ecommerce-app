import { ShieldCheck, Truck, RotateCcw } from "lucide-react"

const BADGES = [
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: Truck, label: "Fast shipping" },
  { icon: RotateCcw, label: "30-day returns" },
]

export default function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-6 gap-y-3 ${className}`}>
      {BADGES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-muted"
        >
          <Icon size={15} className="text-accent" />
          {label}
        </div>
      ))}
    </div>
  )
}
