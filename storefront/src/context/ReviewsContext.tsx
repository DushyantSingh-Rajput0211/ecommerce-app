"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"

export interface Review {
  id: string
  author: string
  rating: number // 1..5
  body: string
  createdAt: number
}

type ReviewMap = Record<string, Review[]>

interface ReviewsContextType {
  getReviews: (handle: string) => Review[]
  getSummary: (handle: string) => { average: number; count: number }
  addReview: (
    handle: string,
    review: { author: string; rating: number; body: string }
  ) => void
}

const ReviewsContext = createContext<ReviewsContextType | null>(null)

const STORAGE_KEY = "reviews_v1"

// A few seeded reviews so the section isn't empty on first visit.
function seedReviews(): ReviewMap {
  return {
    "sony-wh-1000xm4-headphones": [
      {
        id: "r1",
        author: "Alex M.",
        rating: 5,
        body: "The noise cancellation is unreal on flights. Battery lasts forever.",
        createdAt: 3,
      },
      {
        id: "r2",
        author: "Priya S.",
        rating: 4,
        body: "Fantastic sound, super comfortable. Touch controls take a day to learn.",
        createdAt: 2,
      },
    ],
    "nike-air-zoom-pegasus-40": [
      {
        id: "r3",
        author: "Jordan T.",
        rating: 5,
        body: "My daily trainer. Responsive and true to size.",
        createdAt: 1,
      },
    ],
    "apple-watch-series-9": [
      {
        id: "r4",
        author: "Sam R.",
        rating: 4,
        body: "Double tap is genuinely useful. Display is noticeably brighter.",
        createdAt: 1,
      },
    ],
  }
}

let reviewCounter = 100

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<ReviewMap>(() => seedReviews())

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setReviews(JSON.parse(raw))
    } catch {
      /* keep seed */
    }
  }, [])

  const persist = useCallback((next: ReviewMap) => {
    setReviews(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore quota */
    }
  }, [])

  const getReviews = useCallback(
    (handle: string) =>
      [...(reviews[handle] ?? [])].sort((a, b) => b.createdAt - a.createdAt),
    [reviews]
  )

  const getSummary = useCallback(
    (handle: string) => {
      const list = reviews[handle] ?? []
      if (list.length === 0) return { average: 0, count: 0 }
      const average =
        list.reduce((sum, r) => sum + r.rating, 0) / list.length
      return { average, count: list.length }
    },
    [reviews]
  )

  const addReview = useCallback(
    (
      handle: string,
      review: { author: string; rating: number; body: string }
    ) => {
      const entry: Review = {
        id: `r_${reviewCounter++}`,
        author: review.author.trim() || "Anonymous",
        rating: Math.max(1, Math.min(5, review.rating)),
        body: review.body.trim(),
        createdAt: (reviews[handle]?.length ?? 0) + reviewCounter,
      }
      persist({ ...reviews, [handle]: [...(reviews[handle] ?? []), entry] })
    },
    [reviews, persist]
  )

  return (
    <ReviewsContext.Provider value={{ getReviews, getSummary, addReview }}>
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error("useReviews must be inside ReviewsProvider")
  return ctx
}
