# Roadmap — E-Commerce Storefront

Progress tracker toward a **live, transacting store**. The storefront experience is complete;
remaining work is backend integration, payments, content, and go-live configuration.

## Overall completion: ~62%

| Area | Weight | Status | % |
|---|---|---|---|
| Storefront UX (frontend) | 25% | ✅ Complete | 100% |
| Engineering infra (CI, PR previews, hosting) | 10% | ✅ Complete | 100% |
| Pre-launch hardening (security headers, SEO, a11y) | 10% | 🟡 In progress | 70% |
| Commerce backend (Medusa live + data API) | 20% | ⬜ Not started | 0% |
| Payments (Stripe cards/Apple Pay/Google Pay + cash) | 15% | ⬜ Not started | 0% |
| Notifications (order email via Resend) | 5% | ⬜ Not started | 0% |
| Domain + go-live config | 5% | ⬜ Not started | 0% |
| Legal & compliance | 5% | ⬜ Not started | 0% |
| Content & branding (real products/images/brand) | 5% | ⬜ Not started | 0% |

---

## ✅ Done
- Neon-on-dark design system + motion (Framer Motion)
- Full shopping UX: home, collections, product listing w/ URL filters+sort, instant search,
  product detail (lightbox, stock, size guide, reviews, related), cart drawer, multi-step
  checkout UI, order confirmation
- Accounts area: mock auth, order history, wishlist, recently viewed, profile, addresses
- Admin catalog manager (`/admin`) with image upload + live preview
- Accessibility (focus states, skip link, landmarks) + SEO metadata + Product JSON-LD
- CI (typecheck + build) + automated review + Vercel preview per PR; branded error pages

## 🟡 In progress — pre-launch hardening (no backend required)
- [x] Security headers (HSTS, nosniff, frame protection, referrer/permissions policy)
- [x] Tighten Next image allowlist (drop wildcard host)
- [x] Harden JSON-LD output (escaping)
- [x] `.env.example` for onboarding
- [x] `sitemap.xml` + `robots.txt`
- [ ] Full Content-Security-Policy (script/style nonces)
- [ ] Product-listing SSR/SEO (currently client-rendered)
- [ ] Analytics (Vercel Analytics / GA4)
- [ ] Lighthouse pass (target 80+ mobile)

## ⬜ Backend integration (requires owner accounts)
- [ ] Deploy Medusa to Railway; fix `/store/products`; connect Supabase + Upstash
- [ ] Swap each context's data source from `localStorage` → Medusa API
- [ ] Real product persistence (admin edits visible to all users)
- [ ] Real customer + admin auth (replace client-side mocks)
- [ ] Orders land in Medusa admin for fulfillment

## ⬜ Payments
- [ ] Stripe Payment Element — Visa/Mastercard/Discover + Apple Pay + Google Pay
- [ ] Server-side totals + webhook signature verification
- [ ] Apple Pay domain verification
- [ ] Cash on delivery / pickup (manual provider)
- [ ] Sales tax + shipping configuration

## ⬜ Notifications
- [ ] Order confirmation email (Resend via Medusa subscriber)

## ⬜ Domain & go-live
- [ ] Connect custom domain in Vercel + DNS
- [ ] `NEXT_PUBLIC_SITE_URL` + backend CORS to production domain
- [ ] Rotate all secrets before launch

## ⬜ Legal & compliance
- [ ] Privacy Policy, Terms, Returns/Refund Policy
- [ ] Cookie/consent notice
- [ ] Account/data deletion

## ⬜ Content & branding
- [ ] Real product catalog + licensed product images (replace placeholders)
- [ ] Brand name, logo, favicon, social share image

---

## Sequence to 100%
1. **Pre-launch hardening** (in progress — no backend needed).
2. **Backend live** (Medusa + Supabase + Upstash on Railway).
3. **Data-source swap** (contexts → API) + real auth.
4. **Payments** (Stripe + cash) with server-side totals + webhooks.
5. **Email + legal + content/branding**.
6. **Domain + secret rotation + final QA** → launch.
