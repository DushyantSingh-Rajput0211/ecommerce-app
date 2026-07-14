"use client"

import { useEffect } from "react"

// Reference-counted body scroll lock shared by all overlays (mobile menu,
// cart drawer, modals). The body stays locked while ANY overlay is open and
// only unlocks once the last one closes — so overlays can't clobber each
// other's scroll state regardless of open/close order.
let lockCount = 0
let previousOverflow = ""

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    // Capture any pre-existing inline overflow when acquiring the first lock,
    // so we restore it (not just clear it) when the last lock releases.
    if (lockCount === 0) previousOverflow = document.body.style.overflow
    lockCount += 1
    document.body.style.overflow = "hidden"
    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) document.body.style.overflow = previousOverflow
    }
  }, [active])
}
