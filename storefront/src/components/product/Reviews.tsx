"use client"

import { useState } from "react"
import { useReviews } from "@/context/ReviewsContext"
import { useToast } from "@/context/ToastContext"
import { Stars, StarInput } from "@/components/ui/Stars"
import Button from "@/components/ui/Button"

export default function Reviews({ handle }: { handle: string }) {
  const { getReviews, getSummary, addReview } = useReviews()
  const { toast } = useToast()
  const reviews = getReviews(handle)
  const { average, count } = getSummary(handle)

  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [author, setAuthor] = useState("")
  const [body, setBody] = useState("")
  const [error, setError] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (rating < 1) return setError("Please choose a rating.")
    if (!body.trim()) return setError("Please write a short review.")
    addReview(handle, { author, rating, body })
    setRating(0)
    setAuthor("")
    setBody("")
    setError("")
    setOpen(false)
    toast("Thanks for your review!")
  }

  const inputCls =
    "w-full bg-card border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"

  return (
    <section className="mt-24 border-t border-border pt-14">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-semibold">Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            {count > 0 ? (
              <>
                <Stars rating={average} size={16} />
                <span className="text-sm text-muted">
                  {average.toFixed(1)} · {count} review{count === 1 ? "" : "s"}
                </span>
              </>
            ) : (
              <span className="text-sm text-muted">No reviews yet</span>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? "Cancel" : "Write a review"}
        </Button>
      </div>

      {open && (
        <form
          onSubmit={submit}
          className="glass rounded-xl p-6 mb-10 space-y-4 max-w-xl"
        >
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
              Your rating
            </label>
            <StarInput value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
              Name
            </label>
            <input
              className={inputCls}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name (optional)"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
              Review
            </label>
            <textarea
              className={`${inputCls} min-h-[90px] resize-y`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What did you think?"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" variant="gradient" size="sm">
            Submit review
          </Button>
        </form>
      )}

      {reviews.length > 0 && (
        <ul className="space-y-6 max-w-2xl">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-border pb-6 last:border-0">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-medium">{r.author}</span>
                <Stars rating={r.rating} size={13} />
              </div>
              <p className="text-sm text-muted leading-relaxed">{r.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
