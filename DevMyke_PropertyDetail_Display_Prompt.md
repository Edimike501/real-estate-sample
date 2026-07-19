# AI Agent Prompt — Property Detail Page Full Display
# Opollo Luxury Properties — Public + Admin

---

## CONTEXT

The property detail page currently only displays:
- Title, listing type badge, status badge
- Price + currency toggle
- Description
- Map

All other rich property data stored in the database is not being rendered.
This prompt fixes the public-facing property detail page AND the admin property
view/edit page to display all relevant fields in a well-structured, visually
organised layout — conditionally rendered based on `listingType`.

Read every section before writing any code. Modify existing files — do not
recreate them.

---

## ABSOLUTE RULES

1. Strictly typed — no `any`.
2. All listing-type-specific sections rendered via a Map pattern keyed on
   `ListingType` enum — no `if/else chains`.
3. All enum values imported from `types/enums.ts`.
4. CSS variable tokens only — no hardcoded hex colours.
5. Mobile-first layout. Every section must work at 375px.
6. Use `CloudinaryImage` from `components/shared/cloudinary-image.tsx` for
   all images.
7. Null/undefined fields must be handled gracefully — if a field has no value,
   either hide it or show a clear "Not specified" fallback. Never show
   "undefined" or blank broken UI.

---

## SECTION A — PUBLIC PROPERTY DETAIL PAGE

**File to modify:** `app/(site)/properties/[slug]/page.tsx`
**Supporting components to create/modify:**
- `components/property/PropertyDetailHero.tsx` — image gallery (already exists, keep)
- `components/property/PropertyDetailInfo.tsx` — CREATE THIS (main info panel)
- `components/property/PropertyDetailSpecs.tsx` — CREATE THIS (specs grid)
- `components/property/PropertyDetailListingFields.tsx` — CREATE THIS (conditional fields)
- `components/property/PropertyDetailFeatures.tsx` — CREATE THIS (at-a-glance icons row)

---

### LAYOUT STRUCTURE (public detail page)

```
[Image Gallery — full width, top]

[Two-column layout below on desktop, single column on mobile]

LEFT COLUMN (flex-1, main content):
  1. Badges row (ListingType + PropertyStatus)
  2. Title (h1, display font)
  3. Location line (city, state, country — with map pin icon)
  4. Price block (PriceDisplay + CurrencyToggle)
  5. At-a-Glance Features Row (icons: bedrooms, bathrooms, toilets, size)
  6. Property Description card
  7. Listing-Type-Specific Fields section (conditional — see spec below)
  8. Virtual Tour embed (if virtualTourUrl exists)
  9. Map + Get Directions

RIGHT COLUMN (sticky sidebar, w-[380px] on desktop, hidden on mobile):
  10. Enquiry Card (sticky — stays visible as user scrolls)
      - Guest session pre-fill
      - Name, phone, email fields
      - WhatsApp enquiry button
      - Share Property button
      - Bookmark button
      - "Listed X days ago" + recency
      - Negotiation status badge
```

---

### COMPONENT: `PropertyDetailFeatures.tsx`

At-a-glance icon row displayed prominently below the price.
Only render each item if the value is not null/undefined.

```typescript
// Props: property: Property (full Prisma type)

// Renders a horizontal row of feature pills/cards:

const FEATURE_ITEMS = [
  { key: "bedrooms",  icon: "BedDouble",   label: (v) => `${v} Bed${v !== 1 ? "s" : ""}` },
  { key: "bathrooms", icon: "Bath",        label: (v) => `${v} Bath${v !== 1 ? "s" : ""}` },
  { key: "toilets",   icon: "Toilet",      label: (v) => `${v} Toilet${v !== 1 ? "s" : ""}` },
  { key: "sizeSqm",   icon: "Maximize2",   label: (v) => `${v.toLocaleString()} sqm` },
  { key: "landSizeSqm", icon: "Map",       label: (v) => `${v.toLocaleString()} sqm land` },
]

// Each feature pill:
// - Icon (lucide-react) + value label
// - Background: --color-bg-secondary
// - Border: --color-border
// - Border-radius: --radius-md
// - Padding: 0.75rem 1rem
// - Only renders if property[key] != null

// If listingType === LAND: show landSizeSqm instead of sizeSqm and bedrooms/bathrooms
// If listingType === DEVELOPMENT: show sizeSqm + bedrooms + bathrooms
// If listingType === SALE or RENTAL: show all applicable fields
```

---

### COMPONENT: `PropertyDetailSpecs.tsx`

A clean two-column specification grid for shared property details.

```typescript
// Props: property: Property

// Renders a labelled grid of property specs
// Each row: Label (muted, small caps) | Value (regular weight)
// Use CSS Grid: grid-cols-2 on desktop, grid-cols-1 on mobile

// Always show (if value exists):
const SHARED_SPECS = [
  { label: "Property Type",   value: (p) => formatListingType(p.listingType) },
  { label: "Status",          value: (p) => formatStatus(p.status) },
  { label: "City",            value: (p) => p.city },
  { label: "State",           value: (p) => p.state },
  { label: "Country",         value: (p) => p.country },
  { label: "Size",            value: (p) => p.sizeSqm ? `${p.sizeSqm.toLocaleString()} sqm` : null },
  { label: "Bedrooms",        value: (p) => p.bedrooms },
  { label: "Bathrooms",       value: (p) => p.bathrooms },
  { label: "Toilets",         value: (p) => p.toilets },
  { label: "Title Type",      value: (p) => p.titleType },
  { label: "Address",         value: (p) => p.address || p.landmark },
  { label: "Year Built",      value: (p) => p.yearBuilt },
  { label: "Negotiation",     value: (p) => formatNegotiationStatus(p.negotiationStatus) },
]

// Helper formatters (define in this file or lib/formatters.ts):
function formatListingType(type: ListingType): string {
  const map: Record<ListingType, string> = {
    SALE: "For Sale",
    RENTAL: "For Rent",
    LAND: "Land",
    DEVELOPMENT: "Off Plan / Development",
  }
  return map[type]
}

function formatStatus(status: PropertyStatus): string {
  const map: Record<PropertyStatus, string> = {
    AVAILABLE: "Available",
    SOLD: "Sold",
    LET: "Let",
    UNDER_OFFER: "Under Offer",
    COMING_SOON: "Coming Soon",
  }
  return map[status]
}

function formatNegotiationStatus(status: NegotiationStatus): string {
  const map: Record<NegotiationStatus, string> = {
    FIXED: "Fixed Price",
    NEGOTIABLE: "Price Negotiable",
    CONTACT_FOR_PRICE: "Contact for Price",
  }
  return map[status]
}

// Skip any spec row where value is null/undefined/empty
```

---

### COMPONENT: `PropertyDetailListingFields.tsx`

This is the most important component. It conditionally renders listing-type-specific
fields using a Map pattern — NOT if/else chains.

```typescript
// Props: property: Property

// ── THE MAP PATTERN ──────────────────────────────────────────────────────────
// Define a map keyed on ListingType. Each entry is a React component or
// render function that receives the property and returns the relevant fields.

import { ListingType, PriceFrequency } from "@/types/enums"

type ListingFieldRenderer = (property: Property) => React.ReactNode

const LISTING_TYPE_FIELDS: Record<ListingType, ListingFieldRenderer> = {

  [ListingType.SALE]: (property) => (
    <div className="listing-fields">
      <h3>Sale Details</h3>
      <SpecRow label="Sale Price"        value={formatNGN(property.salePrice)} />
      <SpecRow label="Negotiation"       value={formatNegotiationStatus(property.negotiationStatus)} />
      <SpecRow label="Title Type"        value={property.titleType} />
      <SpecRow label="Year Built"        value={property.yearBuilt?.toString()} />
    </div>
  ),

  [ListingType.RENTAL]: (property) => (
    <div className="listing-fields">
      <h3>Rental Details</h3>
      <SpecRow label="Rental Price"      value={formatRentalPrice(property.rentalPrice, property.priceFrequency)} />
      <SpecRow label="Available From"    value={formatDate(property.availableFrom)} />
      <SpecRow label="Lease Term"        value={property.leaseTerm} />
      <SpecRow label="Service Charge"    value={formatNGN(property.serviceCharge)} />
      <SpecRow label="Caution Fee"       value={formatNGN(property.cautionFee)} />
      <SpecRow label="Furnished"         value={formatFurnished(property.furnished)} />
      <SpecRow label="Pets Allowed"      value={formatBoolean(property.petsAllowed)} />
    </div>
  ),

  [ListingType.LAND]: (property) => (
    <div className="listing-fields">
      <h3>Land Details</h3>
      <SpecRow label="Sale Price"        value={formatNGN(property.salePrice)} />
      <SpecRow label="Land Size"         value={property.landSizeSqm ? `${property.landSizeSqm.toLocaleString()} sqm` : null} />
      <SpecRow label="Title Type"        value={property.titleType} />
      <SpecRow label="Zoning Type"       value={property.zoningType} />
      <SpecRow label="Negotiation"       value={formatNegotiationStatus(property.negotiationStatus)} />
    </div>
  ),

  [ListingType.DEVELOPMENT]: (property) => (
    <div className="listing-fields">
      <h3>Development Details</h3>
      <SpecRow label="Starting Price"    value={formatNGN(property.salePrice)} />
      <SpecRow label="Negotiation"       value={formatNegotiationStatus(property.negotiationStatus)} />
      <SpecRow label="Est. Completion"   value={formatDate(property.estimatedCompletion)} />
      <SpecRow label="Title Type"        value={property.titleType} />
      <SpecRow label="Year Built"        value={property.yearBuilt?.toString()} />
    </div>
  ),
}

// Usage — renders the correct fields based on listingType:
export function PropertyDetailListingFields({ property }: { property: Property }) {
  const renderer = LISTING_TYPE_FIELDS[property.listingType]
  if (!renderer) return null
  return <section className="...styling...">{renderer(property)}</section>
}

// ── HELPER COMPONENTS ────────────────────────────────────────────────────────

// SpecRow: renders a single label/value pair
// If value is null/undefined/empty string: render nothing (return null)
function SpecRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="spec-row">
      <span className="spec-label">{label}</span>
      <span className="spec-value">{value}</span>
    </div>
  )
}

// ── FORMATTING HELPERS ───────────────────────────────────────────────────────
// Define in lib/formatters.ts and import here

// formatNGN(amount): "₦240,000,000" or null if amount is null
// formatDate(date): "15 June 2025" or null if date is null
// formatRentalPrice(price, frequency):
//   "₦500,000 / month" | "₦5,000,000 / year" | "₦500,000" (ONE_OFF)
// formatFurnished(value):
//   true → "Furnished" | false → "Unfurnished" | null → null
// formatBoolean(value):
//   true → "Yes" | false → "No" | null → null
```

---

### VIRTUAL TOUR SECTION

If `property.virtualTourUrl` is not null:

```typescript
// Render below the listing-type fields section
// Heading: "Virtual Tour"
// Behaviour:
//   - If URL is a YouTube or Vimeo URL: render an <iframe> embed
//   - If URL is any other URL: render a styled link button
//     with ExternalLink icon: "View Virtual Tour"
// Iframe: width 100%, height 400px on desktop / 220px on mobile
// Wrapper: rounded border, overflow hidden
// Always open external links in new tab with rel="noopener noreferrer"

function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be")
}

function isVimeoUrl(url: string): boolean {
  return url.includes("vimeo.com")
}

function getEmbedUrl(url: string): string | null {
  // Convert youtube.com/watch?v=ID → youtube.com/embed/ID
  // Convert youtu.be/ID → youtube.com/embed/ID
  // Convert vimeo.com/ID → player.vimeo.com/video/ID
  // Return null if not embeddable
}
```

---

### ENQUIRY SIDEBAR CARD (sticky, right column)

```typescript
// This is the sticky enquiry card in the right column on desktop.
// On mobile: hide this sidebar — the sticky bottom bar handles mobile enquiry.

// Contents:
// ┌─────────────────────────────────────┐
// │ 💬 Enquire About This Property      │
// │─────────────────────────────────────│
// │ Negotiation badge (FIXED / NEGOTIABLE / CONTACT FOR PRICE)
// │                                     │
// │ [Name input]                        │
// │ [Phone input]                       │
// │ [Email input — optional]            │
// │ [Message textarea — optional]       │
// │                                     │
// │ [Chat on WhatsApp ← full width btn] │
// │                                     │
// │ [♡ Save Property]  [↗ Share]        │
// │─────────────────────────────────────│
// │ Listed 3 days ago                   │
// └─────────────────────────────────────┘

// Pre-fills from guest session (useGuestSession hook)
// On submit:
//   1. POST /api/inquiries with all data
//   2. Open WhatsApp link returned from API
//   3. Save guest session with new details (overrides old)
// Validation:
//   name: required
//   phone: required, Nigerian or international format acceptable
//   email: optional but validated if provided
```

---

## SECTION B — ADMIN PROPERTY VIEW / EDIT PAGE

**File to modify:** `app/(admin)/dashboard/properties/[id]/edit/page.tsx`
**Supporting components to modify:** `components/admin/PropertyForm.tsx`

---

### ADMIN PROPERTY FORM — CONDITIONAL SECTIONS VIA MAP

The current admin form shows generic fields but does not render
listing-type-specific fields. Fix this using the same Map pattern.

```typescript
// In PropertyForm.tsx:

// When listingType changes (watch("listingType")):
// Use a Map to determine which field sections to render:

type FieldSectionRenderer = (form: UseFormReturn<PropertyFormData>) => React.ReactNode

const LISTING_TYPE_FORM_SECTIONS: Record<ListingType, FieldSectionRenderer> = {

  [ListingType.SALE]: (form) => (
    <FormSection title="Sale Details">
      <FormField label="Sale Price (₦)" name="salePrice" type="number" />
      <FormField label="Negotiation Status" name="negotiationStatus" type="select"
        options={Object.values(NegotiationStatus)} />
      <FormField label="Title Type" name="titleType" type="text"
        placeholder="e.g. C of O, Deed of Assignment, Governor's Consent" />
      <FormField label="Year Built" name="yearBuilt" type="number"
        placeholder="e.g. 2022" />
    </FormSection>
  ),

  [ListingType.RENTAL]: (form) => (
    <FormSection title="Rental Details">
      <FormField label="Rental Price (₦)" name="rentalPrice" type="number" />
      <FormField label="Price Frequency" name="priceFrequency" type="select"
        options={Object.values(PriceFrequency)} />
      <FormField label="Available From" name="availableFrom" type="date" />
      <FormField label="Lease Term" name="leaseTerm" type="text"
        placeholder="e.g. 1 year minimum" />
      <FormField label="Service Charge (₦/year)" name="serviceCharge" type="number" />
      <FormField label="Caution Fee (₦)" name="cautionFee" type="number" />
      <FormField label="Furnished" name="furnished" type="select"
        options={["Not specified", "Furnished", "Unfurnished"]} />
      <FormField label="Pets Allowed" name="petsAllowed" type="select"
        options={["Not specified", "Yes", "No"]} />
    </FormSection>
  ),

  [ListingType.LAND]: (form) => (
    <FormSection title="Land Details">
      <FormField label="Sale Price (₦)" name="salePrice" type="number" />
      <FormField label="Land Size (sqm)" name="landSizeSqm" type="number" />
      <FormField label="Title Type" name="titleType" type="text"
        placeholder="e.g. C of O, Deed of Assignment, Excision" />
      <FormField label="Zoning Type" name="zoningType" type="text"
        placeholder="e.g. Residential, Commercial, Mixed Use" />
      <FormField label="Negotiation Status" name="negotiationStatus" type="select"
        options={Object.values(NegotiationStatus)} />
    </FormSection>
  ),

  [ListingType.DEVELOPMENT]: (form) => (
    <FormSection title="Development Details">
      <FormField label="Starting Price (₦)" name="salePrice" type="number" />
      <FormField label="Negotiation Status" name="negotiationStatus" type="select"
        options={Object.values(NegotiationStatus)} />
      <FormField label="Estimated Completion" name="estimatedCompletion" type="date" />
      <FormField label="Title Type" name="titleType" type="text"
        placeholder="e.g. C of O, Governor's Consent" />
      <FormField label="Year Built" name="yearBuilt" type="number"
        placeholder="e.g. 2024 (if partially complete)" />
    </FormSection>
  ),
}

// In the form JSX, render the conditional section:
const listingType = watch("listingType")
const renderListingFields = LISTING_TYPE_FORM_SECTIONS[listingType]

// In the form layout:
{renderListingFields && renderListingFields(form)}
```

---

### ADMIN FORM SECTION ORDER

Restructure the property form into clearly labelled collapsible or separated sections:

```
Section 1: Basic Information
  - Property Title
  - Slug / URL identifier (auto-generated, editable)
  - Description
  - Listing Type (dropdown — changing this re-renders Section 4)
  - Property Status
  - Negotiation Status (if applicable to listing type)
  - isFeatured toggle
  - isPinned toggle

Section 2: Location
  - City
  - State
  - Country
  - Street Address (optional)
  - Landmark / Area (optional)
  - Map Picker (drag pin)
  - Latitude / Longitude (auto-filled by map picker, editable)

Section 3: Property Specs (shared across all listing types)
  - Bedrooms (number input, optional)
  - Bathrooms (number input, optional)
  - Toilets (number input, optional)
  - Size (sqm) (number input, optional)

Section 4: [CONDITIONAL — based on Listing Type]
  → Rendered by LISTING_TYPE_FORM_SECTIONS map above

Section 5: Media
  - MediaUploader (photos, max 10)
  - Virtual Tour URL (text input)

Section 6: Save Actions
  - Save as Draft button
  - Publish / Update button
  - Delete / Archive button (destructive, requires confirm)
```

Each section should be visually separated with a heading and a subtle divider.
On mobile, sections stack vertically. On desktop, some fields can be in a 2-column grid.

---

### ADMIN PROPERTY DETAIL VIEW (read-only, before editing)

When an admin clicks to view a property (before clicking Edit), they should see
a clean read-only preview that mirrors the public page layout but inside the
admin panel.

**File to create:** `app/(admin)/dashboard/properties/[id]/page.tsx`

```typescript
// Admin property detail view — read-only
// Layout:
// Top: Property title + status badge + listing type badge
// Action bar: [Edit Property] [Archive] [Duplicate] [View on Site ↗]
//
// Below in two columns:
// LEFT: All property details rendered using same PropertyDetailSpecs
//       and PropertyDetailListingFields components as the public page
//       (these components are already built in Section A above —
//        reuse them here, they are not admin-specific)
//
// RIGHT:
//   - Inquiry count for this property
//   - "View all inquiries for this property" link
//   - Media grid (all uploaded images using CloudinaryImage)
//   - Map (read-only, using PropertyMap component)
//
// This page replaces navigating straight to /edit —
// admin sees a clean overview first, then clicks Edit to modify
```

---

## `lib/formatters.ts` — CREATE THIS FILE

Centralised formatting utilities used by both public and admin components.

```typescript
// lib/formatters.ts

import { NegotiationStatus, PriceFrequency, ListingType, PropertyStatus } from "@/types/enums"

export function formatNGN(amount: number | null | undefined): string | null {
  if (amount == null) return null
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string | null | undefined): string | null {
  if (!date) return null
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function formatRentalPrice(
  price: number | null | undefined,
  frequency: PriceFrequency | null | undefined
): string | null {
  if (price == null) return null
  const base = formatNGN(price)
  const freqMap: Record<PriceFrequency, string> = {
    ONE_OFF: "",
    PER_MONTH: " / month",
    PER_YEAR: " / year",
  }
  const suffix = frequency ? freqMap[frequency] : ""
  return `${base}${suffix}`
}

export function formatListingType(type: ListingType): string {
  const map: Record<ListingType, string> = {
    SALE: "For Sale",
    RENTAL: "For Rent",
    LAND: "Land",
    DEVELOPMENT: "Off Plan / Development",
  }
  return map[type]
}

export function formatPropertyStatus(status: PropertyStatus): string {
  const map: Record<PropertyStatus, string> = {
    AVAILABLE: "Available",
    SOLD: "Sold",
    LET: "Let",
    UNDER_OFFER: "Under Offer",
    COMING_SOON: "Coming Soon",
  }
  return map[status]
}

export function formatNegotiationStatus(status: NegotiationStatus): string {
  const map: Record<NegotiationStatus, string> = {
    FIXED: "Fixed Price",
    NEGOTIABLE: "Price Negotiable",
    CONTACT_FOR_PRICE: "Contact for Price",
  }
  return map[status]
}

export function formatFurnished(value: boolean | null | undefined): string | null {
  if (value === null || value === undefined) return null
  return value ? "Furnished" : "Unfurnished"
}

export function formatBoolean(value: boolean | null | undefined): string | null {
  if (value === null || value === undefined) return null
  return value ? "Yes" : "No"
}

export function formatSize(sqm: number | null | undefined): string | null {
  if (sqm == null) return null
  return `${sqm.toLocaleString()} sqm`
}
```

---

## BUILD ORDER

1. Create `lib/formatters.ts` — all other components depend on this
2. Create `components/property/PropertyDetailFeatures.tsx`
3. Create `components/property/PropertyDetailSpecs.tsx`
4. Create `components/property/PropertyDetailListingFields.tsx`
5. Update `app/(site)/properties/[slug]/page.tsx` — restructure layout
6. Update enquiry sidebar on property detail page
7. Create `app/(admin)/dashboard/properties/[id]/page.tsx` — admin read-only view
8. Update `components/admin/PropertyForm.tsx` — add LISTING_TYPE_FORM_SECTIONS map
9. Verify all null/undefined fields render gracefully in both public and admin views
10. Test each listing type (SALE, RENTAL, LAND, DEVELOPMENT) — confirm the right
    fields appear and the wrong ones are hidden

---

## WHAT SUCCESS LOOKS LIKE

**Public property detail page:**
- Hero image gallery (full width, swipeable on mobile)
- At-a-glance feature pills: beds, baths, toilets, size — instantly visible
- Full specs grid: all non-null property attributes in a clean two-column table
- Listing-type-specific section with the correct fields for that type only
- Virtual tour embed or link if URL is provided
- Sticky enquiry card on desktop (right column), sticky bottom bar on mobile
- Map + Get Directions below
- Zero broken UI from null fields — everything handles gracefully

**Admin property form:**
- Form split into 6 clearly labelled sections
- Section 4 re-renders instantly when listing type dropdown changes
- Correct fields for each listing type shown, irrelevant fields hidden
- All existing fields still functional (location, media, map picker)

**Admin property detail view (new read-only page):**
- Clean overview of all property data before editing
- Inquiry count + quick link to filtered inquiries
- Media grid
- Action bar with Edit, Archive, Duplicate, View on Site
