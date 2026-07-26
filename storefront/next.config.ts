import type { NextConfig } from "next"

// Applied to every response. Conservative set that hardens clickjacking,
// MIME sniffing, referrer leakage, and forces HTTPS — without a strict CSP
// that would require nonces (tracked in ROADMAP as a follow-up).
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Clickjacking protection that doesn't affect scripts/styles.
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Seed/product imagery
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Supabase Storage (product images once the backend is wired)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
