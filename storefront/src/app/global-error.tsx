"use client"

// Replaces the root layout when a top-level error occurs, so it renders its
// own <html>/<body> with self-contained styles.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080b",
          color: "#f2f2f5",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: "0 0 0.75rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#8a8a93", margin: "0 0 2rem", fontSize: "0.9rem" }}>
            A critical error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              cursor: "pointer",
              border: "none",
              color: "#fff",
              padding: "0.9rem 2rem",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              fontSize: "0.7rem",
              background:
                "linear-gradient(115deg, #7c3aed 0%, #06b6d4 55%, #ec4899 100%)",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
