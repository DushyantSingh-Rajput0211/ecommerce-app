import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import Providers from "@/components/providers/Providers"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://my-store.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "My Store — Premium Goods",
    template: "%s · My Store",
  },
  description: "Limited quantities. Shipped worldwide. Designed to stand out.",
  keywords: ["shop", "store", "fashion", "electronics", "ecommerce"],
  openGraph: {
    type: "website",
    siteName: "My Store",
    title: "My Store — Premium Goods",
    description: "Limited quantities. Shipped worldwide. Designed to stand out.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "My Store — Premium Goods",
    description: "Limited quantities. Shipped worldwide.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-bg text-fg min-h-screen">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
