export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin ${className}`}
    />
  )
}
