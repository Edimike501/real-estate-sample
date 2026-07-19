# AI Agent Prompt — UX Improvements
# Opollo Luxury Properties — Next.js Fullstack

---

## CONTEXT

This prompt extends the existing Opollo Luxury Properties codebase. The app is a full-stack Next.js 14+ application with:
- App Router, TypeScript (strict mode), Tailwind CSS, Prisma + PostgreSQL
- Public-facing property listing site
- Admin dashboard for property and inquiry management
- WhatsApp inquiry flow
- Guest session persistence via localStorage (7-day TTL)
- `types/enums.ts` as single source of truth for all enums

Read the full prompt before writing a single line of code. Each task references specific files — locate and modify those files directly. Do not recreate files that already exist.

---

## ABSOLUTE RULES

1. All changes must be strictly typed — no `any`, no `unknown` without narrowing.
2. All new categorical values must use existing enums from `types/enums.ts`. If a new enum value is needed, add it there first.
3. Do not break existing functionality. Every change is additive or a safe modification.
4. All new client-side state or effects must be in components marked `"use client"`.
5. No hardcoded content — all strings that belong in metadata stay in `metadata/site.ts`.
6. Mobile-first. Every UI change must work at 375px width.
7. Follow the existing design system — use CSS variable tokens from `globals.css` only.

---

## TASK 1 — WhatsApp Message Includes Property Link

**Files to modify:**
- `lib/whatsapp.ts`
- Any component that calls `buildWhatsAppLink()` or `buildWhatsAppMessage()`

**What to do:**

In `lib/whatsapp.ts`, update `BuildWhatsAppLinkParams` to accept an optional `propertyUrl` field:

```typescript
type BuildWhatsAppLinkParams = {
  guestName: string
  guestPhone: string
  propertyTitle?: string
  propertyLocation?: string
  propertyUrl?: string        // ← ADD: full public URL to the property page
  source: InquirySource
  customMessage?: string
}
```

Update `buildWhatsAppMessage()` to append the property link at the end of the message in a clean structured format:

```typescript
export function buildWhatsAppMessage(params: BuildWhatsAppLinkParams): string {
  const { guestName, propertyTitle, propertyLocation, propertyUrl, customMessage } = params
  if (customMessage) return customMessage

  if (propertyTitle) {
    return (
      `Hi Opollo Luxury Properties, my name is ${guestName}.\n\n` +
      `I'm interested in the following property:\n` +
      `*${propertyTitle}*` +
      (propertyLocation ? `\n📍 ${propertyLocation}` : "") +
      (propertyUrl ? `\n🔗 ${propertyUrl}` : "") +
      `\n\nPlease get back to me. Thank you.`
    )
  }
  return (
    `Hi Opollo Luxury Properties, my name is ${guestName}.\n\n` +
    `I'd like to make a general enquiry about your properties.`
  )
}
```

Wherever `buildWhatsAppLink()` is called on a property page or card, pass:
```typescript
propertyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.slug}`
```

---

## TASK 2 — "Share This Property" Button

**Files to create:**
- `components/property/SharePropertyButton.tsx`

**Files to modify:**
- `app/(site)/properties/[slug]/page.tsx` — add `SharePropertyButton` to the property detail page

**What to build:**

```typescript
// components/property/SharePropertyButton.tsx
"use client"

// Props:
// propertyTitle: string
// propertyUrl: string

// Behaviour:
// 1. If navigator.share is available (mobile browsers), call:
//    navigator.share({ title: propertyTitle, url: propertyUrl })
// 2. If not available (desktop), copy propertyUrl to clipboard using
//    navigator.clipboard.writeText(propertyUrl)
//    Then show a temporary "Link copied!" tooltip for 2 seconds
// 3. Button label: "Share Property"
// 4. Icon: use lucide-react Share2 icon
// 5. Style: outline button using CSS variable tokens
// 6. On mobile it triggers native share sheet — covers WhatsApp, iMessage, email etc.
```

Place `SharePropertyButton` in the property detail hero section, near the WhatsApp enquiry button.

---

## TASK 3 — Currency Toggle (NGN / Foreign Currency)

**Files to create:**
- `hooks/useCurrencyRate.ts`
- `components/property/CurrencyToggle.tsx`
- `components/property/PriceDisplay.tsx`

**Files to modify:**
- `components/property/PropertyCard.tsx` — use `PriceDisplay`
- `app/(site)/properties/[slug]/page.tsx` — use `PriceDisplay` + `CurrencyToggle`

### `hooks/useCurrencyRate.ts`

Fetch live exchange rates from the **ExchangeRate-API free tier** (`https://open.er-api.com/v6/latest/NGN`). This endpoint is free with no API key required.

```typescript
"use client"

// Supported foreign currencies for Diaspora markets
export type DiasporaCurrency = "GBP" | "USD" | "CAD" | "AED" | "EUR"

export type CurrencyRates = {
  rates: Partial<Record<DiasporaCurrency, number>>  // rate: 1 NGN = X foreign
  lastUpdated: string
  loading: boolean
  error: boolean
}

// useCurrencyRate():
// - Fetches from https://open.er-api.com/v6/latest/NGN on mount
// - Caches result in localStorage under key "opollo_fx_rates" with a 6-hour TTL
//   (exchange rates don't need to refresh more than twice a day)
// - Returns { rates, lastUpdated, loading, error }
// - On error, returns empty rates object with error: true
//   (PriceDisplay falls back to NGN only if rates are unavailable)
```

### `components/property/CurrencyToggle.tsx`

```typescript
"use client"

// Props:
// selected: DiasporaCurrency | "NGN"
// onChange: (currency: DiasporaCurrency | "NGN") => void

// Renders a pill-style toggle row with options:
// NGN | USD | GBP | CAD | AED | EUR
// Active pill: accent background, white text
// Inactive pill: border only, muted text
// Mobile: horizontally scrollable if pills overflow
// Label above: "View prices in:"
```

### `components/property/PriceDisplay.tsx`

```typescript
"use client"

// Props:
// ngnAmount: number | null | undefined
// currency: DiasporaCurrency | "NGN"
// rates: Partial<Record<DiasporaCurrency, number>>
// frequency?: PriceFrequency  // for rental display
// negotiationStatus?: NegotiationStatus
// size?: "sm" | "md" | "lg"   // controls font size

// Behaviour:
// 1. If negotiationStatus === NegotiationStatus.CONTACT_FOR_PRICE:
//    Render "Contact for Price" in accent colour — no amount shown
//
// 2. If currency === "NGN" OR rates[currency] is unavailable:
//    Format ngnAmount as: ₦45,000,000
//
// 3. If a foreign currency is selected AND rate exists:
//    - Convert: foreignAmount = ngnAmount * rates[currency]
//    - Show BOTH:
//        Primary line (large): formatted foreign amount e.g. £28,400
//        Secondary line (small, muted): ₦45,000,000 NGN
//    - Use Intl.NumberFormat for currency formatting:
//        new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })
//
// 4. If frequency is provided (rentals):
//    Append frequency label: "/ month" or "/ year"
//
// 5. Show a small disclaimer below the price:
//    "Rate as of [lastUpdated]. For reference only."
//    Style: x-small, muted — only shown when a foreign currency is active

// Currency symbol map (fallback if Intl isn't available):
// USD → $, GBP → £, CAD → CA$, AED → AED, EUR → €
```

### Where to place the toggle:

On the **property detail page** — place `CurrencyToggle` above the price, so the user selects their currency and `PriceDisplay` updates reactively.

On **PropertyCard** — use `PriceDisplay` with a shared currency context so if a user selects GBP on the listings page, all cards update at once.

### Shared currency state:

Create a simple context `CurrencyContext` in `context/CurrencyContext.tsx` that wraps the `(site)` layout. Stores the selected currency in state and localStorage so it persists across page navigations within the session.

---

## TASK 4 — Sticky WhatsApp Enquiry Button (Mobile)

**Files to modify:**
- `app/(site)/properties/[slug]/page.tsx`

On the property detail page, add a sticky bottom bar that is **only visible on mobile** (`md:hidden`):

```typescript
// Sticky bottom bar — mobile only
// Contains:
// - Property title truncated to 1 line
// - "Enquire on WhatsApp" button (full width on mobile)
// Behaviour:
// - Fixed to bottom of viewport
// - Has a subtle top border using --color-border
// - Background: --color-bg-primary with backdrop-blur
// - Appears after the user scrolls past the main hero enquiry button
//   (use IntersectionObserver on the hero button ref — hide sticky when hero button is visible)
// - z-index: 50
```

---

## TASK 5 — "Save for Later" Bookmarks (No Account Required)

**Files to create:**
- `hooks/useBookmarks.ts`
- `components/property/BookmarkButton.tsx`
- `components/property/SavedPropertiesDrawer.tsx`

**Files to modify:**
- `components/property/PropertyCard.tsx` — add `BookmarkButton`
- `app/(site)/properties/[slug]/page.tsx` — add `BookmarkButton`
- `components/layout/Navbar.tsx` — add saved properties icon with count badge

### `hooks/useBookmarks.ts`

```typescript
"use client"

// Stores bookmarked property IDs in localStorage under "opollo_bookmarks"
// TTL: 7 days (same as guest session)
// Structure: { ids: string[], savedAt: number }

// Returns:
// bookmarks: string[]                      // array of property IDs
// isBookmarked: (id: string) => boolean
// toggleBookmark: (id: string) => void     // adds if not present, removes if present
// clearBookmarks: () => void
// count: number
```

### `components/property/BookmarkButton.tsx`

```typescript
"use client"

// Props:
// propertyId: string
// variant?: "icon" | "button"  // icon = heart only, button = heart + label

// Behaviour:
// - Uses useBookmarks hook
// - "icon" variant: Heart icon (lucide-react), filled when bookmarked
// - Filled state: accent colour heart
// - Empty state: outline heart, muted colour
// - On toggle: brief scale animation (scale 1 → 1.2 → 1)
// - No text on card variant, "Saved" / "Save Property" label on detail page variant
```

### `components/property/SavedPropertiesDrawer.tsx`

```typescript
"use client"

// A slide-in drawer from the right side
// Triggered by clicking the bookmark icon in the Navbar
// Shows a list of bookmarked property IDs with:
// - Property title and location fetched via GET /api/properties?ids=id1,id2,id3
// - Thumbnail using CloudinaryImage
// - "View Property" link
// - Remove bookmark button (X icon)
// - Empty state: "No saved properties yet. Tap the heart icon on any listing to save it."
// - "Clear all" button at the bottom
```

Update `GET /api/properties` route to support `?ids=` param:
```typescript
// If ids query param is present, return only those specific properties
// ids is a comma-separated list of property IDs
// Still filters out soft-deleted properties
```

Add to `Navbar.tsx`:
- Bookmark icon (lucide-react `Bookmark`) with a count badge showing number of saved properties
- Clicking it opens `SavedPropertiesDrawer`
- Badge hidden when count is 0

---

## TASK 6 — Property Status Badge Always Visible on Cards

**Files to modify:**
- `components/property/PropertyCard.tsx`
- `components/property/ListingTypeBadge.tsx`

Ensure every property card shows BOTH badges prominently:

```typescript
// Top-left of card image: ListingType badge (FOR SALE / FOR RENT / LAND / OFF PLAN)
// Top-right of card image: PropertyStatus badge (AVAILABLE / SOLD / LET / UNDER OFFER / COMING SOON)

// Status badge colours (use CSS variables, not hardcoded hex):
// AVAILABLE   → green background, white text
// SOLD        → red background, white text
// LET         → red background, white text
// UNDER_OFFER → amber background, dark text
// COMING_SOON → neutral/muted background, muted text

// SOLD and LET cards:
// - Apply a subtle grayscale or reduced opacity overlay on the card image (opacity: 0.7)
// - Status badge should remain fully opaque and visible
// - Card is still fully clickable — user can still view the detail page
// - Do NOT hide or remove sold/let properties from the grid
```

---

## TASK 7 — Virtual Tour Badge on Listing Cards

**Files to modify:**
- `components/property/PropertyCard.tsx`

```typescript
// If property.virtualTourUrl is truthy:
// Show a badge on the card image (bottom-left):
// Icon: lucide-react Play icon
// Label: "Virtual Tour"
// Style: dark semi-transparent background, white text, small pill shape
// Position: absolute, bottom-left of the card image
```

---

## TASK 8 — "Listed X days ago" Recency Indicator

**Files to create:**
- `lib/timeAgo.ts`

**Files to modify:**
- `components/property/PropertyCard.tsx`
- `app/(site)/properties/[slug]/page.tsx`

### `lib/timeAgo.ts`

```typescript
// Pure utility — no dependencies

export function timeAgo(date: Date | string): string {
  // Returns human-readable relative time:
  // < 1 day   → "Listed today"
  // 1 day     → "Listed yesterday"
  // 2-6 days  → "Listed 3 days ago"
  // 1 week    → "Listed 1 week ago"
  // 2-3 weeks → "Listed 2 weeks ago"
  // 1+ month  → "Listed [month] [year]" e.g. "Listed May 2025"
  // Uses property.createdAt as the input date
}
```

Show the output of `timeAgo(property.createdAt)` on:
- Property cards: small text, muted colour, below the price
- Property detail page: near the listing type badge

---

## TASK 9 — Empty State on Search / Filter Results

**Files to modify:**
- `components/property/PropertyGrid.tsx`

```typescript
// When the API returns 0 properties for the current filter/search state:
// Show a centred empty state block:
//
// Icon: lucide-react SearchX
// Heading: "No properties found"
// Subtext: "Try adjusting your filters or search terms — or reach out to us directly
//           and we'll help you find exactly what you're looking for."
// Button: "Chat on WhatsApp" (uses buildWhatsAppLink with source: InquirySource.CONTACT_FORM,
//          guestName left blank — the message says:
//          "Hi, I searched for properties on your website but couldn't find what I need.
//           Can you help me?")
//
// Do NOT show this when the initial load is still in progress (show skeleton cards instead)
// Only show after data has resolved with empty results
```

---

## TASK 10 — Swipeable Mobile Image Gallery

**Files to modify:**
- `components/property/PropertyDetailHero.tsx`

Install if not present:
```bash
pnpm add embla-carousel-react
```

```typescript
// Replace any existing gallery implementation with Embla Carousel
// Configuration:
// - loop: true
// - Touch/swipe enabled by default (Embla handles this natively)
// - Show dot indicators below the carousel (current slide / total)
// - Show left/right arrow buttons on desktop (hidden on mobile)
// - Each slide: full-width image using CloudinaryImage component
// - Tap any image → open a fullscreen lightbox overlay:
//   - Dark overlay background
//   - Same swipeable carousel but full-screen
//   - X button to close (top-right)
//   - Image counter: "3 / 8" (top-left)
//   - Escape key closes the lightbox
// - Thumbnail strip below carousel on desktop (click to jump to slide)
```

---

## TASK 11 — Admin: Inquiry Shows Full WhatsApp Message

**Files to modify:**
- `components/admin/InquiryDetail.tsx`

```typescript
// In the inquiry detail view, add a section:
// Label: "WhatsApp Message Sent"
// Content: render inquiry.whatsappMessage in a styled block:
//   - Monospace or slightly rounded text block
//   - Background: --color-bg-tertiary
//   - Border-left: 3px solid accent colour
//   - Preserves line breaks (whitespace-pre-wrap)
//   - "Copy message" button (clipboard icon, copies text)
// This shows the admin the exact message the user sent to WhatsApp
```

---

## TASK 12 — Admin: One-Click Property Link from Inquiry

**Files to modify:**
- `components/admin/InquiryDetail.tsx`
- `components/admin/InquiryTable.tsx`

```typescript
// In InquiryDetail:
// If inquiry.propertyId and inquiry.property exist:
// Show a "View Property" link button that opens:
// `${process.env.NEXT_PUBLIC_APP_URL}/properties/${inquiry.property.slug}`
// in a new tab
// Icon: lucide-react ExternalLink
// Style: outlined accent button

// In InquiryTable:
// Property name column should be a clickable link to the public property page
// Opens in new tab
// If no property (general inquiry), show "General Inquiry" in muted text
```

---

## TASK 13 — Admin: Inquiry Count Badge on Properties Table

**Files to modify:**
- `components/admin/PropertyTable.tsx`
- `app/api/properties/route.ts` (admin GET endpoint)

```typescript
// In the admin properties table, add an "Inquiries" column
// Shows the count of inquiries linked to each property
// Badge style:
//   - 0 inquiries: muted grey badge
//   - 1-5: blue/accent badge
//   - 6+: stronger accent or highlighted badge
// Clicking the badge navigates to:
//   /admin/dashboard/inquiries?propertyId=[id]
//   (the inquiries table filtered to that property)

// API change:
// In the admin GET /api/properties response, include _count: { inquiries: true }
// via Prisma's include or select with _count
// Add to the Prisma query:
//   include: { _count: { select: { inquiries: true } }, media: { take: 1, orderBy: { order: 'asc' } } }
```

---

## TASK 14 — Admin: Inline Inquiry Status Update

**Files to modify:**
- `components/admin/InquiryTable.tsx`

```typescript
// The status column should render an inline <select> dropdown
// (not a badge that requires navigating to the detail page)
// On change:
// - Immediately call PATCH /api/inquiries/[id] with the new status
// - Show a brief loading spinner on the dropdown while the request is in flight
// - On success: update the local table state optimistically
// - On error: revert to previous status and show a toast error notification
// Use InquiryStatus enum for all values
// Style the dropdown to match the existing table design
```

---

## TASK 15 — Admin: Dashboard "Today's Inquiries" Section

**Files to modify:**
- `app/(admin)/dashboard/page.tsx`

```typescript
// At the top of the dashboard overview page, add a "Today's Inquiries" card section
// Fetches from GET /api/inquiries?today=true
// Shows:
//   - Count of new inquiries today (large number, accent colour)
//   - Mini list of up to 5 most recent today:
//     each item: guest name, property title (or "General"), time received (e.g. "2 hours ago")
//   - "View all" link → /admin/dashboard/inquiries
//   - If 0 today: "No inquiries yet today" in muted text

// API change:
// In GET /api/inquiries, support ?today=true query param:
//   Filters where createdAt >= start of current day (midnight UTC)
//   Returns sorted by createdAt DESC

// Below "Today's Inquiries", keep the existing stats/overview content
```

---

## TASK 16 — Admin: Unsaved Changes Warning on Property Form

**Files to modify:**
- `components/admin/PropertyForm.tsx`

```typescript
// Track whether the form has been modified since last save
// Use react-hook-form's formState.isDirty for this

// Two scenarios to handle:

// 1. Browser navigation (back button, closing tab):
//    Add a beforeunload event listener:
//    window.addEventListener("beforeunload", (e) => {
//      if (isDirty) {
//        e.preventDefault()
//        e.returnValue = ""  // triggers browser's native "Leave page?" dialog
//      }
//    })
//    Remove listener on component unmount

// 2. In-app navigation (Next.js router):
//    Use a custom hook that intercepts router.push/back
//    If isDirty, show a custom modal dialog:
//      Title: "Leave without saving?"
//      Body: "You have unsaved changes. If you leave now, your changes will be lost."
//      Buttons: "Stay on page" (cancel) | "Leave anyway" (confirm, then navigate)
//    Style the modal using existing CSS variable tokens
```

---

## TASK 17 — Admin: Image Position Numbers in Media Uploader

**Files to modify:**
- `components/admin/MediaUploader.tsx`

```typescript
// Each image in the uploader preview grid must show:
// 1. A position number badge (1, 2, 3...) in the top-left corner of each image
//    Style: small dark circle, white text, position: absolute top-left
// 2. A "★ Cover" label on position 1 only:
//    Below or overlaid on the first image
//    Style: gold/accent coloured small tag
//    Tooltip on hover: "This is the cover image shown in listing cards"
// 3. When images are reordered (via drag), position numbers update reactively
// 4. The image at position 1 after reorder is always the cover image
```

---

## TASK 18 — Admin: Duplicate Property Feature

**Files to modify:**
- `components/admin/PropertyTable.tsx`
- `app/api/properties/[id]/route.ts`

```typescript
// In the properties table, add a "Duplicate" action to each row's action menu
// (alongside Edit and Delete)

// API: POST /api/properties/[id]/duplicate
// Creates a new property with:
//   - All fields copied from the original
//   - title: "[Original Title] (Copy)"
//   - slug: auto-generated new unique slug
//   - status: PropertyStatus.COMING_SOON  (not AVAILABLE — admin must review before publishing)
//   - isFeatured: false
//   - isPinned: false
//   - createdAt / updatedAt: current timestamp
//   - media: NOT copied (admin uploads fresh media for the new listing)
//   - inquiries: NOT copied

// After duplication:
// Navigate to the edit page of the new duplicated property
// Show a toast: "Property duplicated. Review and update details before publishing."
```

---

## TASK 19 — Admin: Filter Inquiries by Property

**Files to modify:**
- `components/admin/InquiryTable.tsx`
- `app/(admin)/dashboard/inquiries/page.tsx`
- `app/api/inquiries/route.ts`

```typescript
// Add a "Filter by Property" dropdown above the inquiries table
// Populated by GET /api/properties?select=id,title (lightweight list, no media)
// On select: filters the table to show only inquiries for that property
// Updates URL query param: ?propertyId=[id]
// "Clear filter" X button to reset

// Also reads ?propertyId from URL on mount (from the badge click in TASK 13)
// and pre-selects the correct property in the dropdown

// API change:
// GET /api/inquiries supports ?propertyId=[id] query param
// Adds where: { propertyId } to the Prisma query when present
```

---

## TASK 20 — Admin: Archived Properties Tab with Restore

**Files to modify:**
- `app/(admin)/dashboard/properties/page.tsx`
- `components/admin/PropertyTable.tsx`
- `app/api/properties/[id]/route.ts`

```typescript
// Add two tabs above the properties table:
// Tab 1: "Active" (default) — shows properties where deletedAt IS NULL
// Tab 2: "Archived" — shows properties where deletedAt IS NOT NULL

// In the "Archived" tab:
// Each row shows the property with a muted/greyed style
// Actions column shows only: "Restore" button (no Edit, no Delete)
// Restore: PATCH /api/properties/[id] with body { restore: true }
//   Sets deletedAt back to null
//   Returns the restored property
// After restore: remove from archived tab, show toast: "Property restored successfully."

// In the "Active" tab:
// "Delete" action now clearly says "Archive" in the UI
// Tooltip: "Archived properties are hidden from the site but can be restored"

// Tab switching updates URL query param: ?tab=active | ?tab=archived
// Persists on page refresh
```

---

## SCHEMA ADDITIONS (apply to `prisma/schema.prisma`)

Add the following fields to the `Property` model to support the new features:

```prisma
// Add to Property model:

// For bookmarks — no schema change needed (stored client-side in localStorage)

// For duplicate feature tracking:
duplicatedFrom    String?   // stores the original property ID if this was duplicated

// For development listing type:
estimatedCompletion DateTime?  // when the development is expected to complete

// For land listings — additional detail:
zoningType        String?   // e.g. "Residential", "Commercial", "Mixed Use"

// For rental listings — additional detail:
furnished         Boolean?  // null = not specified, true = furnished, false = unfurnished
petsAllowed       Boolean?  // null = not specified

// For sale listings — additional detail:
yearBuilt         Int?      // year the property was built

// These fields are nullable — they don't affect existing records
// Run: npx prisma migrate dev --name add_ux_fields
```

---

## BUILD ORDER

Follow this exact order to avoid dependency issues:

1. Apply Prisma schema additions → `npx prisma migrate dev --name add_ux_fields` → `npx prisma generate`
2. Update `lib/whatsapp.ts` (Task 1)
3. Create `lib/timeAgo.ts` (Task 8)
4. Create `hooks/useBookmarks.ts` (Task 5)
5. Create `hooks/useCurrencyRate.ts` (Task 3)
6. Create `context/CurrencyContext.tsx` (Task 3)
7. Update `types/enums.ts` if any new enum values are needed
8. Create `components/property/PriceDisplay.tsx` (Task 3)
9. Create `components/property/CurrencyToggle.tsx` (Task 3)
10. Create `components/property/BookmarkButton.tsx` (Task 5)
11. Create `components/property/SharePropertyButton.tsx` (Task 2)
12. Update `components/property/ListingTypeBadge.tsx` (Task 6)
13. Update `components/property/PropertyCard.tsx` (Tasks 6, 7, 8, 3, 5)
14. Update `components/property/PropertyDetailHero.tsx` (Task 10)
15. Create `components/property/SavedPropertiesDrawer.tsx` (Task 5)
16. Update `app/(site)/properties/[slug]/page.tsx` (Tasks 1, 2, 3, 4)
17. Update `components/property/PropertyGrid.tsx` (Task 9)
18. Update `components/layout/Navbar.tsx` (Task 5)
19. Update `app/api/properties/route.ts` (Tasks 13, 19)
20. Update `app/api/inquiries/route.ts` (Tasks 15, 19)
21. Update `app/api/properties/[id]/route.ts` (Task 20)
22. Create `app/api/properties/[id]/duplicate/route.ts` (Task 18)
23. Update `components/admin/InquiryDetail.tsx` (Tasks 11, 12)
24. Update `components/admin/InquiryTable.tsx` (Tasks 12, 14, 19)
25. Update `components/admin/PropertyTable.tsx` (Tasks 13, 18, 20)
26. Update `components/admin/MediaUploader.tsx` (Task 17)
27. Update `components/admin/PropertyForm.tsx` (Task 16)
28. Update `app/(admin)/dashboard/page.tsx` (Task 15)
29. Update `app/(admin)/dashboard/properties/page.tsx` (Task 20)
30. Update `app/(admin)/dashboard/inquiries/page.tsx` (Task 19)

---

## WHAT SUCCESS LOOKS LIKE

When complete:

**Public site:**
- Sharing a property on WhatsApp sends a message with the property name, location, and a clickable link back to the listing
- Visitors can tap "Share Property" to share via native share sheet or copy link
- Currency toggle on property pages and listing grid lets users switch between NGN, GBP, USD, CAD, AED, EUR with live rates
- Rates cached for 6 hours in localStorage — not fetched on every page load
- WhatsApp enquiry button is sticky at the bottom on mobile and disappears when the hero button is visible
- Heart icon on every property card saves/unsaves to localStorage with a 7-day TTL
- Saved properties accessible from a drawer triggered in the navbar
- Sold and Let badges are clearly visible on listing cards — no user clicks in only to discover it's already gone
- Virtual tour badge is visible on cards before the user clicks in
- "Listed 3 days ago" on every card and detail page
- Empty search results show a helpful message and a direct WhatsApp button
- Property image gallery on detail page is swipeable on mobile with fullscreen lightbox on tap

**Admin dashboard:**
- "Today's Inquiries" is the first thing the admin sees on the dashboard
- Every inquiry detail shows the exact WhatsApp message that was sent, with a copy button
- Property name in inquiry table and detail is a clickable link to the public listing
- Properties table shows inquiry count per listing with a link to filtered inquiries
- Inquiry status updatable inline in the table without navigating away
- Property form warns before navigating away with unsaved changes
- Media uploader shows position numbers and marks position 1 as the cover image
- Properties can be duplicated from the table with one click
- Inquiries can be filtered by property from the URL or the dropdown
- Soft-deleted properties live in an "Archived" tab and can be restored with one click
