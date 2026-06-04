# AI Agent Build Prompt — Phase 2: Full Feature Expansion
# Opollo Luxury Properties Ltd — Next.js Fullstack

---

## CONTEXT & CONTINUITY

This prompt is a **direct continuation** of the Phase 1 build prompt. Before proceeding, verify the following from Phase 1 are present and intact:

### Phase 1 Verification Checklist
- [x] Next.js 14+ App Router project scaffold exists
- [x] TypeScript is configured with strict mode ON (`"strict": true` in tsconfig.json)
- [x] Tailwind CSS with CSS variable tokens in `app/globals.css`
- [x] `metadata/site.ts` and `metadata/properties.ts` exist
- [x] `types/index.ts` exists with base interfaces
- [x] `lib/utils.ts` with `cn()` helper exists
- [x] `app/api/` folder exists with placeholder route handlers
- [x] `next-themes` installed and ThemeProvider configured in `app/layout.tsx`
- [x] `framer-motion` installed
- [x] All section components exist under `components/sections/`
- [x] WhatsApp floating (fixed) button present on all pages
- [x] `components/shared/cloudinary-image.tsx` exists — **verify this file is present before Phase 2 begins. If missing, create it per the spec in the MEDIA PIPELINE section below.**

If any of the above are missing, scaffold them before proceeding with Phase 2.

---

## PHASE 2 MISSION

Expand the existing codebase into a **fully featured, production-ready real estate platform** with:
- A complete relational database schema
- Full property listing system with listing type differentiation
- Inquiry capture, storage, and WhatsApp routing
- Super admin dashboard with CMS capabilities
- Media optimisation pipeline using Sharp + Cloudinary + `CloudinaryImage` component
- Map integration per property using OpenStreetMap (free, no billing required)
- Search and filter functionality with debounce on all search inputs
- Browser-side session persistence for guest users (7-day TTL)
- Email notifications on inquiry
- Strict TypeScript and enum-driven logic throughout

Read every section of this prompt before writing a single line of code.

---

## ABSOLUTE RULES — NEVER VIOLATE

1. **Strict TypeScript everywhere.** No `any`, no `unknown` without narrowing. Every function, component, API handler, and utility must be fully typed.
2. **All status fields, type fields, and categorical values use enums.** Never use raw strings for state logic.
3. **All enums live in `types/enums.ts`.** Import from there everywhere. Never redefine an enum inline.
4. **No property or inquiry is ever hard-deleted from the database** unless an explicit SUPER_ADMIN deletion action is triggered. Use soft delete with `deletedAt` timestamps.
5. **All database queries go through Prisma.** No raw SQL unless absolutely necessary, and if so, comment why.
6. **Media optimisation is non-negotiable.** Every uploaded image goes through the Sharp compression pipeline before Cloudinary upload. All media display uses the `CloudinaryImage` component from `components/shared/cloudinary-image.tsx`.
7. **Every API route is typed end to end** — request body, response shape, and error states.
8. **Files may exceed 300 lines when the feature demands it.** However, logic must still be modular — extract reusable hooks, utilities, and sub-components into separate files rather than keeping everything in one bloated file. Length is acceptable; tangled, non-reusable code is not.
9. **All search inputs across the entire app must use debounce** via the `useDebounce` hook. No search, filter, or query fires on every keystroke.
10. **Prisma version must be v6+ (latest stable).** Verify `package.json` after install.

---

## UPDATED PROJECT STRUCTURE

Extend Phase 1 structure with the following additions:

```
/
├── app/
│   ├── (site)/                     # Public-facing site (grouped route)
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Homepage
│   │   ├── properties/
│   │   │   ├── page.tsx            # All listings with search + filter
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Individual property detail page
│   │   └── contact/
│   │       └── page.tsx
│   │
│   ├── (admin)/                    # Admin dashboard (grouped route)
│   │   ├── layout.tsx              # Admin layout with sidebar nav
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx            # Overview/stats
│   │       ├── properties/
│   │       │   ├── page.tsx        # All properties table
│   │       │   ├── new/
│   │       │   │   └── page.tsx    # Create property form
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx
│   │       ├── inquiries/
│   │       │   ├── page.tsx        # All inquiries table
│   │       │   └── [id]/
│   │       │       └── page.tsx    # Inquiry detail
│   │       └── users/
│   │           └── page.tsx        # Manage ALL users (SUPER_ADMIN only)
│   │                               # Handles admin users now, platform users later
│   │
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts        # NextAuth handler
│       ├── properties/
│       │   ├── route.ts            # GET all, POST create
│       │   └── [id]/
│       │       └── route.ts        # GET one, PATCH update, DELETE soft-delete
│       ├── inquiries/
│       │   ├── route.ts            # GET all (admin), POST create (public)
│       │   └── [id]/
│       │       └── route.ts        # PATCH update status
│       ├── media/
│       │   └── upload/
│       │       └── route.ts        # POST media upload with compression
│       └── users/
│           └── route.ts            # GET, POST, PATCH users (SUPER_ADMIN only)
│
├── components/
│   ├── layout/                     # Existing
│   ├── sections/                   # Existing
│   ├── ui/                         # Existing
│   ├── shared/
│   │   └── cloudinary-image.tsx    # EXISTING — do not recreate, only extend
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── PropertyForm.tsx        # Unified create/edit form
│   │   ├── PropertyTable.tsx
│   │   ├── InquiryTable.tsx
│   │   ├── InquiryDetail.tsx
│   │   ├── MediaUploader.tsx       # Drag + drop with preview and compression
│   │   ├── MapPicker.tsx           # Admin: pick property location on map
│   │   └── UserTable.tsx           # Was AdminUserTable — now manages ALL user types
│   └── property/
│       ├── PropertyCard.tsx        # Updated — uses CloudinaryImage for media
│       ├── PropertyGrid.tsx        # Grid with search/filter bar
│       ├── PropertyFilter.tsx      # Location, price, bedrooms filter UI
│       ├── PropertyDetailHero.tsx  # Hero image + gallery — uses CloudinaryImage
│       ├── PropertyMap.tsx         # Public map view + route (OpenStreetMap/Leaflet)
│       ├── InquiryForm.tsx         # Guest inquiry form (session-aware)
│       └── ListingTypeBadge.tsx    # SALE / RENTAL / LAND / DEVELOPMENT badge
│
├── hooks/
│   ├── use-debounce.hooks.ts     # Debounce hook — used by ALL search inputs
│   ├── useGuestSession.ts          # Wraps lib/session.ts for React
│   └── useProperties.ts            # TanStack Query hook for property fetching
│
├── lib/
│   ├── utils.ts                    # Existing cn() + new helpers
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth.ts                     # NextAuth config
│   ├── media.ts                    # Sharp compression + Cloudinary upload pipeline
│   ├── email.ts                    # Resend email helper
│   ├── whatsapp.ts                 # WhatsApp link builder utility
│   └── session.ts                  # Browser session TTL logic (localStorage)
│
├── prisma/
│   ├── schema.prisma               # Full DB schema (see spec below)
│   └── seed.ts                     # Seed script with sample data
│
├── types/
│   ├── index.ts                    # All shared interfaces
│   └── enums.ts                    # ALL enums (single source of truth)
│
└── middleware.ts                   # Protect /admin routes
```

---

## ENUMS — `types/enums.ts`

This file is the **single source of truth** for all categorical values. Every enum used anywhere in the app must be defined here. No enum is ever defined inline in a component or API route.

```typescript
// types/enums.ts

export enum ListingType {
  SALE        = "SALE",        // Built house/property for outright purchase
  RENTAL      = "RENTAL",      // Apartment or space available for rent
  LAND        = "LAND",        // Land only, no structure
  DEVELOPMENT = "DEVELOPMENT"  // Under construction / off-plan
}

export enum PropertyStatus {
  AVAILABLE   = "AVAILABLE",
  SOLD        = "SOLD",
  LET         = "LET",         // Rented out
  UNDER_OFFER = "UNDER_OFFER",
  COMING_SOON = "COMING_SOON"
}

export enum InquiryStatus {
  NEW        = "NEW",
  CONTACTED  = "CONTACTED",
  FOLLOW_UP  = "FOLLOW_UP",
  CLOSED     = "CLOSED",
  SPAM       = "SPAM"
}

export enum InquirySource {
  PROPERTY_PAGE  = "PROPERTY_PAGE",
  CONTACT_FORM   = "CONTACT_FORM",
  WHATSAPP_FLOAT = "WHATSAPP_FLOAT",
  FEATURED_CARD  = "FEATURED_CARD"
}

// Renamed from AdminRole → UserRole for scalability.
// Currently used for admin/dashboard access control.
// When public user accounts are introduced, extend this enum
// with USER, AGENT, etc. rather than creating a new one.
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN       = "ADMIN",
  VIEWER      = "VIEWER"   // read-only — future use
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  TOUR  = "TOUR"   // virtual tour URL embed
}

export enum PriceFrequency {
  ONE_OFF   = "ONE_OFF",    // For sales and land
  PER_MONTH = "PER_MONTH",
  PER_YEAR  = "PER_YEAR"
}

export enum NegotiationStatus {
  FIXED             = "FIXED",
  NEGOTIABLE        = "NEGOTIABLE",
  CONTACT_FOR_PRICE = "CONTACT_FOR_PRICE"  // previously CALL_FOR_PRICE
}
```

---

## DATABASE SCHEMA — `prisma/schema.prisma`

### Prisma Version Requirement
Install Prisma v6+ (currently v6.x stable). Verify after install:
```bash
npx prisma --version
# Should show: prisma: 6.x.x
```

Install command:
```bash
npm install prisma@latest @prisma/client@latest
```

After schema changes always run:
```bash
npx prisma generate
npx prisma db push       # development
# or
npx prisma migrate dev   # when ready for migration history
```

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── ENUMS ────────────────────────────────────────────────────────────────────

enum ListingType {
  SALE
  RENTAL
  LAND
  DEVELOPMENT
}

enum PropertyStatus {
  AVAILABLE
  SOLD
  LET
  UNDER_OFFER
  COMING_SOON
}

enum InquiryStatus {
  NEW
  CONTACTED
  FOLLOW_UP
  CLOSED
  SPAM
}

enum InquirySource {
  PROPERTY_PAGE
  CONTACT_FORM
  WHATSAPP_FLOAT
  FEATURED_CARD
}

// Scalable role enum — currently powers admin access.
// Extend here (USER, AGENT, etc.) when public accounts are introduced.
enum UserRole {
  SUPER_ADMIN
  ADMIN
  VIEWER
}

enum MediaType {
  IMAGE
  VIDEO
  TOUR
}

enum PriceFrequency {
  ONE_OFF
  PER_MONTH
  PER_YEAR
}

enum NegotiationStatus {
  FIXED
  NEGOTIABLE
  CONTACT_FOR_PRICE
}

// ── MODELS ───────────────────────────────────────────────────────────────────

model Property {
  id          String            @id @default(cuid())
  slug        String            @unique
  title       String
  description String            @db.Text

  // Type & Status
  listingType       ListingType
  status            PropertyStatus    @default(AVAILABLE)
  negotiationStatus NegotiationStatus @default(NEGOTIABLE)
  isFeatured        Boolean           @default(false)
  isPinned          Boolean           @default(false)

  // Location
  address   String?   // specific address if known
  landmark  String?   // area or landmark if address not confirmed
  city      String
  state     String    @default("Lagos")
  country   String    @default("Nigeria")
  latitude  Float?    // for map pin
  longitude Float?    // for map pin

  // Shared fields
  bedrooms  Int?
  bathrooms Int?
  toilets   Int?
  sizeSqm   Float?

  // Sale-specific
  salePrice Float?

  // Rental-specific
  rentalPrice    Float?
  priceFrequency PriceFrequency?
  availableFrom  DateTime?
  leaseTerm      String?
  serviceCharge  Float?
  cautionFee     Float?

  // Land-specific
  landSizeSqm Float?
  titleType   String?   // C of O, Deed of Assignment, etc.

  // Virtual tour
  virtualTourUrl String?

  // Relations
  media     PropertyMedia[]
  inquiries Inquiry[]

  // Soft delete & timestamps
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // null = active; set = soft deleted
}

model PropertyMedia {
  id           String    @id @default(cuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id])
  url          String    // Cloudinary URL (Sharp-compressed before upload)
  thumbnailUrl String?   // auto-generated 600x400 thumbnail via Sharp
  publicId     String    // Cloudinary public_id — required for deletion/transforms
  mediaType    MediaType @default(IMAGE)
  altText      String?
  order        Int       @default(0)
  createdAt    DateTime  @default(now())
}

model Inquiry {
  id String @id @default(cuid())

  // Guest user details — no account required
  guestName  String
  guestPhone String
  guestEmail String?

  // What triggered this inquiry
  propertyId String?
  property   Property?  @relation(fields: [propertyId], references: [id])
  source     InquirySource
  message    String?    @db.Text

  // WhatsApp tracking — full message stored for admin review
  whatsappNumber  String
  whatsappMessage String @db.Text

  // Admin management
  status     InquiryStatus @default(NEW)
  adminNotes String?       @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Scalable user model — currently stores admin/dashboard users only.
// When public user accounts are introduced, add fields like
// profileImage, savedProperties, etc. and extend UserRole enum.
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // hashed with bcrypt
  role      UserRole @default(ADMIN)
  isActive  Boolean  @default(true)
  createdBy String?  // ID of SUPER_ADMIN who created this user

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## BROWSER SESSION — `lib/session.ts`

Guest user details persist in `localStorage` with a 7-day TTL. Submitting new details always overwrites the previous session.

```typescript
// lib/session.ts

const SESSION_KEY = "opollo_guest"
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export type GuestSession = {
  name: string
  phone: string
  email?: string
  savedAt: number
}

export function getGuestSession(): GuestSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: GuestSession = JSON.parse(raw)
    if (Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function setGuestSession(data: Omit<GuestSession, "savedAt">): void {
  if (typeof window === "undefined") return
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...data, savedAt: Date.now() }))
}

export function clearGuestSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
}
```

---

## DEBOUNCE HOOK — `hooks/use-debounce.hooks.ts`

This hook is **mandatory** for every search input in the app. No search query, filter text input, or autocomplete field fires a request on every keystroke. Minimum debounce delay is 400ms.

```typescript
// hooks/use-debounce.hooks.ts

import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Rule: only update if characters typed is more than 1, or if it's empty (to reset search)
    if (typeof value === "string") {
      if (value.length === 1) {
        return
      }
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

### Usage pattern — apply this everywhere search exists:

```typescript
// Example: PropertyFilter.tsx or any search input

import { useDebounce } from "@/hooks/use-debounce.hooks"

const [searchInput, setSearchInput] = useState("")
const debouncedSearch = useDebounce(searchInput, 400)

// Only this effect fires the API call — NOT the raw searchInput
useEffect(() => {
  if (debouncedSearch !== undefined) {
    updateQueryParams({ search: debouncedSearch })
  }
}, [debouncedSearch])
```

**Apply `useDebounce` to all of the following:**
- Property search text input on `/properties`
- City/area search in `PropertyFilter.tsx`
- Search input in `PropertyTable.tsx` (admin)
- Search input in `InquiryTable.tsx` (admin)
- Search input in `UserTable.tsx` (admin)
- Any future autocomplete or live-search input

---

## MEDIA PIPELINE — `lib/media.ts` + `components/shared/cloudinary-image.tsx`

### Two-layer approach:
1. **Upload pipeline** (`lib/media.ts`) — Sharp compresses before Cloudinary upload
2. **Display layer** (`components/shared/cloudinary-image.tsx`) — Cloudinary URL transforms + Next.js Image optimisation

---

### Upload Pipeline — `lib/media.ts`

```typescript
// lib/media.ts
// Requires: npm install sharp cloudinary

import sharp from "sharp"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export type UploadResult = {
  url: string
  thumbnailUrl: string
  publicId: string
}

export async function uploadPropertyMedia(
  buffer: Buffer,
  fileName: string,
  propertyId: string
): Promise<UploadResult> {

  // Step 1 — Sharp compression before upload (saves Cloudinary bandwidth)
  const [compressed, thumbnail] = await Promise.all([
    sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true })
      .toBuffer(),
    sharp(buffer)
      .resize({ width: 600, height: 400, fit: "cover" })
      .jpeg({ quality: 75 })
      .toBuffer(),
  ])

  const folder = `opollo/properties/${propertyId}`

  // Step 2 — Upload both to Cloudinary
  const [main, thumb] = await Promise.all([
    uploadBuffer(compressed, `${folder}/${fileName}`),
    uploadBuffer(thumbnail, `${folder}/thumbs/${fileName}`),
  ])

  return {
    url: main.secure_url,
    thumbnailUrl: thumb.secure_url,
    publicId: main.public_id,
  }
}

export async function deletePropertyMedia(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

function uploadBuffer(
  buffer: Buffer,
  publicId: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ public_id: publicId, resource_type: "image" }, (err, result) => {
        if (err || !result) return reject(err)
        resolve(result as { secure_url: string; public_id: string })
      })
      .end(buffer)
  })
}
```

---

### Display Component — `components/shared/cloudinary-image.tsx`

This component is the **only** way images from Cloudinary are rendered anywhere in the app. Do not use raw `<img>` tags or plain `next/image` with Cloudinary URLs directly.

Extend (or replace) the existing component with the following spec. If the existing component already handles some of these, merge carefully — do not delete existing functionality:

```typescript
// components/shared/cloudinary-image.tsx
"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

type CloudinaryTransform = {
  width?: number
  height?: number
  quality?: number | "auto"
  format?: "auto" | "webp" | "avif" | "jpg" | "png"
  crop?: "fill" | "fit" | "scale" | "thumb" | "pad"
  gravity?: "auto" | "face" | "center"
  blur?: number
}

type CloudinaryImageProps = {
  src: string                    // Cloudinary URL or public_id
  alt: string
  width: number
  height: number
  transforms?: CloudinaryTransform
  className?: string
  priority?: boolean             // true for above-the-fold images
  fallbackSrc?: string           // shown if Cloudinary fails
  onLoad?: () => void
  sizes?: string                 // responsive sizes hint for Next.js
}

// Builds a Cloudinary transformation URL from a base URL
function buildCloudinaryUrl(src: string, transforms: CloudinaryTransform): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
    blur,
  } = transforms

  const parts: string[] = []
  if (width)   parts.push(`w_${width}`)
  if (height)  parts.push(`h_${height}`)
  if (crop)    parts.push(`c_${crop}`)
  if (gravity) parts.push(`g_${gravity}`)
  if (blur)    parts.push(`e_blur:${blur}`)
  parts.push(`q_${quality}`)
  parts.push(`f_${format}`)

  const transform = parts.join(",")

  // Insert transformation string into Cloudinary URL
  // e.g. https://res.cloudinary.com/demo/image/upload/w_800,q_auto/sample.jpg
  return src.replace("/upload/", `/upload/${transform}/`)
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  transforms = {},
  className,
  priority = false,
  fallbackSrc = "/images/property-placeholder.jpg",
  onLoad,
  sizes,
}: CloudinaryImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    src ? buildCloudinaryUrl(src, { width, height, ...transforms }) : fallbackSrc
  )
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blur placeholder while loading */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-bg-secondary animate-pulse"
          aria-hidden="true"
        />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes ?? `(max-width: 768px) 100vw, ${width}px`}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => {
          setIsLoading(false)
          onLoad?.()
        }}
        onError={() => setImgSrc(fallbackSrc)}
      />
    </div>
  )
}
```

### Where `CloudinaryImage` must be used:
- `PropertyCard.tsx` — thumbnail display
- `PropertyDetailHero.tsx` — full hero + gallery
- `MediaUploader.tsx` — preview of uploaded images
- Any other location where a Cloudinary URL is rendered

### `next.config.ts` — add Cloudinary domain:
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
  ],
},
```

---

## MAP INTEGRATION — OpenStreetMap + Leaflet (Free, No Billing)

### Why OpenStreetMap + Leaflet
Google Maps requires a billing account and credit card even for free-tier usage. OpenStreetMap is completely free with no API key required for tile rendering. Leaflet is the standard open-source map library that consumes OpenStreetMap tiles.

For reverse geocoding (converting dropped pin coordinates to an address), use **Nominatim** — OpenStreetMap's free geocoding service. No API key needed. Rate limit: 1 request/second, which is sufficient for admin use.

### Engineer Setup Instructions

**No account or API key required for map tiles or geocoding.**

Install dependencies:
```bash
npm install leaflet react-leaflet
npm install @types/leaflet
```

Add Leaflet CSS to `app/layout.tsx` or the relevant layout:
```typescript
import "leaflet/dist/leaflet.css"
```

Fix Leaflet's default marker icon issue in Next.js (known bug):
```typescript
// lib/leaflet-fix.ts — import this once in any component using Leaflet
import L from "leaflet"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})
```

Mark all Leaflet-using components as `"use client"` — Leaflet does not support SSR.

---

### `PropertyMap.tsx` (public — view property location + get directions)

```typescript
"use client"
// Shows the property's map pin using OpenStreetMap tiles via react-leaflet
// "Get Directions" opens Google Maps directions in a new tab
// (Google Maps directions URL is free — no API key needed)
// If no coordinates, shows address/landmark as text fallback

// Props:
// latitude: number | null
// longitude: number | null
// address: string | null
// landmark: string | null
// propertyTitle: string

// Behaviour:
// - Render <MapContainer> from react-leaflet centred on lat/lng
// - Drop a <Marker> with a <Popup> showing the property title
// - "Get Directions" button builds URL:
//   https://www.google.com/maps/dir/?api=1&destination={lat},{lng}
//   This opens Google Maps in browser — no API key required
// - If lat/lng are null, render a styled fallback card showing address or landmark
```

---

### `MapPicker.tsx` (admin — drag pin to set location)

```typescript
"use client"
// Admin property form map — allows dragging a pin to set coordinates
// Uses Nominatim reverse geocoding to auto-fill address after pin drop

// Props:
// initialLat?: number
// initialLng?: number
// onLocationChange: (lat: number, lng: number, address: string) => void

// Behaviour:
// - Render <MapContainer> centred on Lagos (6.5244, 3.3792) by default
// - Draggable <Marker> — on dragend, fire Nominatim reverse geocode:
//   GET https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}
// - Parse response: display_name field → pass to onLocationChange
// - Rate limit: add 1100ms debounce on reverse geocode calls
//   (Nominatim requires max 1 req/sec; 1100ms is safe)
// - Show a small "Locating..." indicator during geocode fetch
// - Coordinates update the property form's latitude/longitude fields in real time
```

---

## WHATSAPP UTILITY — `lib/whatsapp.ts`

```typescript
// lib/whatsapp.ts

import { InquirySource } from "@/types/enums"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!

type BuildWhatsAppLinkParams = {
  guestName: string
  guestPhone: string
  propertyTitle?: string
  propertyLocation?: string
  source: InquirySource
  customMessage?: string
}

export function buildWhatsAppLink(params: BuildWhatsAppLinkParams): string {
  const encoded = encodeURIComponent(buildWhatsAppMessage(params))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function buildWhatsAppMessage(params: BuildWhatsAppLinkParams): string {
  const { guestName, propertyTitle, propertyLocation, customMessage } = params
  if (customMessage) return customMessage
  if (propertyTitle) {
    return (
      `Hi Opollo Luxury Properties, my name is ${guestName}. ` +
      `I'm interested in the property: *${propertyTitle}*` +
      (propertyLocation ? ` located at ${propertyLocation}` : "") +
      `. Please get back to me. Thank you.`
    )
  }
  return (
    `Hi Opollo Luxury Properties, my name is ${guestName}. ` +
    `I'd like to make a general enquiry about your properties.`
  )
}
```

---

## EMAIL — `lib/email.ts`

```typescript
// lib/email.ts
// Requires: npm install resend

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

type InquiryEmailParams = {
  guestName: string
  guestPhone: string
  guestEmail?: string
  propertyTitle?: string
  propertyLocation?: string
  message?: string
  source: string
}

export async function sendInquiryNotification(params: InquiryEmailParams): Promise<void> {
  const { guestName, guestPhone, guestEmail, propertyTitle, propertyLocation, message, source } = params

  await resend.emails.send({
    from:    "Opollo Website <notifications@opolloluxuries.com>",
    to:      process.env.ADMIN_EMAIL!,
    subject: propertyTitle
      ? `New Inquiry: ${propertyTitle}`
      : "New General Inquiry — Opollo Website",
    html: `
      <h2>New Inquiry Received</h2>
      <table cellpadding="8" style="border-collapse:collapse">
        <tr><td><strong>Name:</strong></td><td>${guestName}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${guestPhone}</td></tr>
        ${guestEmail ? `<tr><td><strong>Email:</strong></td><td>${guestEmail}</td></tr>` : ""}
        ${propertyTitle ? `<tr><td><strong>Property:</strong></td><td>${propertyTitle}</td></tr>` : ""}
        ${propertyLocation ? `<tr><td><strong>Location:</strong></td><td>${propertyLocation}</td></tr>` : ""}
        ${message ? `<tr><td><strong>Message:</strong></td><td>${message}</td></tr>` : ""}
        <tr><td><strong>Source:</strong></td><td>${source}</td></tr>
      </table>
      <p>Log into the admin dashboard to manage this inquiry.</p>
    `,
  })
}
```

---

## API ROUTES — SPEC

### `POST /api/inquiries`
Triggered when any WhatsApp button is tapped or form is submitted.

**Request body:**
```typescript
{
  guestName: string
  guestPhone: string
  guestEmail?: string
  propertyId?: string
  source: InquirySource
  message?: string
}
```

**What it does:**
1. Validate all required fields with Zod
2. Fetch property title and location from DB if `propertyId` provided
3. Build WhatsApp message using `buildWhatsAppMessage()`
4. Save full Inquiry record to DB
5. Fire `sendInquiryNotification()` — non-blocking (do not await in the response path)
6. Return WhatsApp link for the client to open

**Response:**
```typescript
{ success: true; whatsappUrl: string; inquiryId: string }
```

---

### `GET /api/properties`
Public endpoint. Supports query params.

**Query params:**
```
?listingType=RENTAL
&state=Lagos
&city=Lekki
&minPrice=500000
&maxPrice=5000000
&bedrooms=3
&status=AVAILABLE
&search=duplex         ← text search on title, description, city, landmark
&featured=true
&page=1
&limit=12
```

**Rules:**
- Never return soft-deleted properties (`deletedAt` must be null)
- Default sort: `isPinned DESC`, `isFeatured DESC`, `createdAt DESC`
- Return paginated results with `{ properties, total, page, totalPages }`
- `search` param queries title, description, city, landmark using Prisma `contains` with `mode: "insensitive"`

---

### `PATCH /api/inquiries/[id]`
Admin only.
```typescript
{ status: InquiryStatus; adminNotes?: string }
```

---

### `POST /api/media/upload`
Admin only. `multipart/form-data`.
1. Receive file buffer
2. Run `uploadPropertyMedia()` — Sharp compress → Cloudinary upload
3. Save `PropertyMedia` record to DB (including `publicId`)
4. Return `{ url, thumbnailUrl, publicId, id }`

---

### `GET /api/users` + `POST /api/users`
SUPER_ADMIN only.
- GET: returns all users (paginated), supports search with debounce on client side
- POST: creates new user with hashed password, role limited to ADMIN or VIEWER via UI (SUPER_ADMIN cannot be created through the API except via seed)

### `PATCH /api/users/[id]`
SUPER_ADMIN only. Update role, isActive. Cannot demote or deactivate self.

---

## ADMIN DASHBOARD — SPEC

### Authentication
- NextAuth.js with Credentials provider
- Session stored as JWT containing `{ id, name, email, role: UserRole }`
- Middleware in `middleware.ts` protects all `/admin/dashboard/*` routes
- Login page at `/admin/login`

### Role & Permission Logic
```typescript
// lib/permissions.ts

import { UserRole } from "@/types/enums"

export const PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: [
    "create", "read", "update", "delete",
    "manage_users", "pin_property", "feature_property"
  ],
  [UserRole.ADMIN]: [
    "create", "read", "update",
    "pin_property", "feature_property"
  ],
  [UserRole.VIEWER]: ["read"],
}

export function can(role: UserRole, action: string): boolean {
  return PERMISSIONS[role]?.includes(action) ?? false
}
```

### User Management page — `/dashboard/users`
- Route is `/dashboard/users` not `/dashboard/admins`
- Table shows all users in the `User` model (currently admin/staff accounts)
- Search input uses `useDebounce` — debounced at 400ms
- Columns: Name, Email, Role badge, Status (Active/Inactive), Created, Actions
- Create new user: name, email, role (ADMIN or VIEWER only — SUPER_ADMIN not creatable via UI)
- Toggle `isActive` to disable without deleting
- SUPER_ADMIN cannot deactivate or demote themselves
- **Designed to scale**: when public user accounts are introduced, this same page and API will manage them with additional role filtering tabs

### Property Form (`PropertyForm.tsx`)
- `listingType` selector — renders conditional fields per type:
  - `SALE`: salePrice, negotiationStatus, titleType
  - `RENTAL`: rentalPrice, priceFrequency, availableFrom, leaseTerm, serviceCharge, cautionFee
  - `LAND`: landSizeSqm, titleType, salePrice
  - `DEVELOPMENT`: salePrice, negotiationStatus, estimated completion date
- Address OR landmark toggle — either field satisfies location requirement
- `MapPicker` component — drag pin to set lat/lng, reverse geocodes to address
- `MediaUploader` — drag and drop, max 10 files, preview grid, reorder by drag, uses `CloudinaryImage` for previews
- Virtual tour URL field
- `isFeatured` + `isPinned` toggles
- `status` + `negotiationStatus` dropdowns using enums

### Inquiry Table (`InquiryTable.tsx`)
- Search input uses `useDebounce` at 400ms
- Columns: Name, Phone, Property, Source, Status badge, Date
- Inline status update per row
- Click → `InquiryDetail` showing full WhatsApp message, property link, admin notes
- Filter by `InquiryStatus`, date range, `InquirySource`

---

## SEARCH & FILTER — `PropertyFilter.tsx`

```typescript
type FilterState = {
  listingType?: ListingType
  state?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  status?: PropertyStatus
  search?: string
}
```

- Filter bar sits above the property grid
- **Text search input** uses `useDebounce` at 400ms before updating URL params
- **City/area input** uses `useDebounce` at 400ms
- All filter changes update URL query params via `useRouter` + `useSearchParams`
- URL is fully shareable — filters persist on page refresh
- `PropertyGrid` reads filter state from URL params and passes to `GET /api/properties`

---

## LISTING TYPE DISPLAY — `ListingTypeBadge.tsx`

```
ListingType:
  SALE        → Gold badge        "For Sale"
  RENTAL      → Blue badge        "For Rent"
  LAND        → Green badge       "Land"
  DEVELOPMENT → Orange badge      "Off Plan"

PropertyStatus:
  AVAILABLE   → Green
  SOLD        → Red   (property card stays visible — never hidden)
  LET         → Red
  UNDER_OFFER → Amber
  COMING_SOON → Grey
```

---

## ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Cloudinary (https://cloudinary.com → free account → Dashboard → API Keys)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend (https://resend.com → free account → API Keys → Create API Key)
RESEND_API_KEY=
ADMIN_EMAIL=

# WhatsApp — no setup needed, just the number with country code, no + or spaces
NEXT_PUBLIC_WHATSAPP_NUMBER=2347049785717

# Maps — NO API KEY NEEDED (OpenStreetMap + Leaflet + Nominatim are free)
# Delete any previous GOOGLE_MAPS_API_KEY references

# App
NEXT_PUBLIC_APP_URL=
```

---

## ADDITIONAL DEPENDENCIES TO INSTALL

```bash
# Core
npm install prisma@latest @prisma/client@latest

# Auth
npm install next-auth bcryptjs
npm install -D @types/bcryptjs

# Media
npm install sharp cloudinary

# Maps (free, no API key)
npm install leaflet react-leaflet
npm install -D @types/leaflet

# Email
npm install resend

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Data fetching (admin dashboard)
npm install @tanstack/react-query

# File upload
npm install react-dropzone
```

---

## BUILD ORDER FOR PHASE 2

Follow this exact order:

1. Install all dependencies above
2. Verify Prisma version is v6+ (`npx prisma --version`)
3. Set up `.env` with all variables
4. Create `types/enums.ts` with all enums (UserRole, not AdminRole)
5. Update `types/index.ts` with all new interfaces
6. Write `prisma/schema.prisma` in full (User model, not AdminUser)
7. Run `npx prisma generate` and `npx prisma db push`
8. Write `lib/prisma.ts` singleton
9. Write `hooks/use-debounce.hooks.ts`
10. Write `lib/session.ts` + `hooks/useGuestSession.ts`
11. Write `lib/whatsapp.ts`
12. Write `lib/media.ts`
13. Verify `components/shared/cloudinary-image.tsx` exists — extend with full spec above
14. Add Cloudinary domain to `next.config.ts`
15. Write `lib/email.ts`
16. Write `lib/auth.ts` + NextAuth route handler
17. Write `lib/permissions.ts`
18. Write `middleware.ts` for admin route protection
19. Write `lib/leaflet-fix.ts`
20. Build all API routes: properties → inquiries → media → users
21. Build `components/property/` bottom-up: `ListingTypeBadge` → `PropertyCard` → `PropertyFilter` (with debounce) → `PropertyGrid` → `PropertyMap` → `InquiryForm` → `PropertyDetailHero`
22. Build `components/admin/`: `MediaUploader` → `MapPicker` → `PropertyForm` → `PropertyTable` → `InquiryTable` → `UserTable`
23. Build admin pages: login → dashboard → properties → inquiries → users
24. Update public property pages to use real API data
25. Write `prisma/seed.ts` with sample data covering all `ListingType` values
26. Run seed, verify all flows end to end

---

## WHAT SUCCESS LOOKS LIKE

When complete:

- A visitor browses properties filtered by type, price, location — all text inputs debounced
- They click a property, see a gallery rendered via `CloudinaryImage`, a map pin via Leaflet/OpenStreetMap, and a "Get Directions" button
- Their inquiry details pre-fill from localStorage on return within 7 days; new details override old ones
- Submitting the form saves to DB, fires an email to admin, and opens WhatsApp with pre-filled message
- The admin logs in, sees all inquiries with the triggering property, updates statuses, manages listings with full CMS
- The SUPER_ADMIN manages all users at `/dashboard/users` — scalable to include public accounts in future
- Every categorical value in the system is driven by an enum from `types/enums.ts`
- `UserRole` is used everywhere (not `AdminRole`) — the model and enum are ready for public user extension
- `NegotiationStatus.CONTACT_FOR_PRICE` is used (not `CALL_FOR_PRICE`)
- No Google Maps API key is required — map runs entirely on free OpenStreetMap + Leaflet + Nominatim

---

## FINAL NOTE TO AI AGENT

Do not skip any section of this spec. Every feature is a confirmed client requirement. Build full structure even where data is sparse. The system must be extensible, strictly typed, and production-ready from day one.

Start with the Phase 1 verification checklist — especially confirm `components/shared/cloudinary-image.tsx` exists. Then proceed through the build order without skipping steps.
