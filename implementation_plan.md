# Sitemap, JSON-LD Structured Data & Location-Aware Pricing

Three features to implement: an enhanced dynamic sitemap, modular JSON-LD schema markup across all pages, and location-aware price display logic.

## Proposed Changes

### Part 1 — Dynamic Sitemap

---

#### [MODIFY] [sitemap.ts](file:///home/devmyke/Documents/GitHub/atu-real-estate/app/sitemap.ts)

Update the existing sitemap to fetch all active (non-deleted) property slugs from Prisma and generate dynamic property URLs alongside the static routes.

- Import `prisma` from `@/lib/prisma`
- Query `prisma.property.findMany()` for `slug` and `updatedAt` where `deletedAt: null`
- Map each property to `{ url: baseUrl/properties/slug, lastModified: updatedAt, changeFrequency: "daily", priority: 0.7 }`
- Wrap the dynamic fetch in try/catch — fallback to static routes only on error

---

### Part 2 — JSON-LD Structured Data

---

#### [NEW] [JsonLd.tsx](file:///home/devmyke/Documents/GitHub/atu-real-estate/components/seo/JsonLd.tsx)

Create a reusable server component wrapper for JSON-LD injection.

- Props: `schema: Record<string, unknown>` (not `any`, per your rule)
- Renders `<script type="application/ld+json" dangerouslySetInnerHTML={...} />`

---

#### [MODIFY] [layout.tsx](file:///home/devmyke/Documents/GitHub/atu-real-estate/app/layout.tsx)

Replace the existing monolithic `RealEstateAgent` JSON-LD block (lines 84–129 & 138–145) with the new `@graph` array containing:

1. **Organization** — `@id: .../#organization`, name, url, logo
   - `sameAs` array present but **commented out** with `/* */` note
2. **WebSite** — `@id: .../#website`, url, name, publisher ref

Import and render `<JsonLd schema={globalOrganizationSchema} />` inside `<head>`.

> [!IMPORTANT]
> The existing `RealEstateAgent` schema in the layout will be **removed** from here — it moves to the homepage `page.tsx` where it semantically belongs.

---

#### [MODIFY] [page.tsx](file:///home/devmyke/Documents/GitHub/atu-real-estate/app/(site)/page.tsx) — Homepage

- Remove the existing commented-out JSON-LD block (lines 11–57, 61–64)
- Add a `RealEstateAgent` schema with Lagos geo-coordinates, `areaServed`, `priceRange: "$$$$"`, and `address`
- `sameAs` array present but **commented out**
- Import and render `<JsonLd schema={homepageSchema} />` before `<main>`

---

#### [MODIFY] [page.tsx](file:///home/devmyke/Documents/GitHub/atu-real-estate/app/(site)/properties/page.tsx) — Properties Archive

- Add a `CollectionPage` schema with `@id: .../#collection`, url, name, description
- Import and render `<JsonLd schema={collectionSchema} />` before the existing `<main>`

---

#### [MODIFY] [page.tsx](file:///home/devmyke/Documents/GitHub/atu-real-estate/app/(site)/contact/page.tsx) — Contact

Replace the existing `RealEstateAgent` JSON-LD (lines 57–84, 91–94) with a proper `ContactPage` schema containing:
- `@type: "ContactPage"`, url, name
- `mainEntity` as `LocalBusiness` with telephone and email
- Remove the inline `<script>` tag and use `<JsonLd />` component instead

---

### Part 3 — Location-Aware Pricing

---

#### [MODIFY] [useDiasporaLocation.ts](file:///home/devmyke/Documents/GitHub/atu-real-estate/hooks/useDiasporaLocation.ts)

Expose a new `isNigerian` boolean from the hook:

- When the browser locale country code is `"NG"`, or when `currency` is `null` (which already maps to Nigeria in `COUNTRY_TO_CURRENCY`), set `isNigerian = true`
- Return `{ currency, isLoading, isNigerian, setDiasporaCurrency, CURRENCY_SYMBOLS }`

The detection logic is: if the mapped currency is `null` (country = NG) → user is in Nigeria.

---

#### [MODIFY] [PropertyCard.tsx](file:///home/devmyke/Documents/GitHub/atu-real-estate/components/property/PropertyCard.tsx)

- Import `useDiasporaLocation` hook
- If `isNigerian === true`: display only `getDisplayPrice(property)` (NGN only)
- If `isNigerian === false`: display `property.diasporaPrice || getDisplayPrice(property)` (current behavior — NGN + foreign currency)

> [!NOTE]
> `PropertyCard` currently does NOT have `"use client"` and is not a client component. To use the hook, we must either:
> - **(A)** Make `PropertyCard` a client component by adding `"use client"` — simplest, and it's already rendered inside client-only parents (`PropertyGrid` and `PropertiesSection`)
> - **(B)** Pass `isNigerian` down as a prop from the parent
>
> **Recommended: Option A** — `PropertyCard` is already only ever used inside client components, so adding `"use client"` has zero impact on the rendering waterfall.

---

#### [MODIFY] [PriceDropdown.tsx](file:///home/devmyke/Documents/GitHub/atu-real-estate/components/property/PriceDropdown.tsx)

This is used on the property detail page. Currently it always shows both the NGN price prominently and the currency dropdown.

- Read `isNigerian` from `useDiasporaLocation()`
- If `isNigerian === true`: show **only** the NGN price (hide the currency dropdown entirely)
- If `isNigerian === false`: show the current behavior (NGN + currency selector)

---

## Open Questions

> [!IMPORTANT]
> **Pricing display for Nigerian visitors on PropertyCard**: The API currently always computes and returns `diasporaPrice` (e.g. `"₦18,000,000 ($12,000)"`). For Nigerian visitors, we'll simply ignore `diasporaPrice` and show the plain NGN-only `getDisplayPrice()` on the client side. This means the API doesn't need changes — the client just hides the diaspora portion. Is this acceptable, or would you prefer the API to stop computing `diasporaPrice` for Nigerian-located requests?

---

## Verification Plan

### Manual Verification
- Visit `/sitemap.xml` and confirm dynamic property slugs appear
- Inspect `<head>` on each page for correct JSON-LD script tags
- Use [Google Rich Results Test](https://search.google.com/test/rich-results) to validate schema markup
- Test price display from a Nigerian locale (browser language `en-NG`) — should see NGN only
- Test price display from a non-Nigerian locale (e.g. `en-US`) — should see NGN + USD

### Build Verification
- Run `pnpm build` to confirm no TypeScript errors or build failures
