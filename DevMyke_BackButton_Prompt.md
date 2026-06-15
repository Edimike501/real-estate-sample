# AI Agent Prompt — Back Button Component & Placement
# Opollo Luxury Properties — Next.js Fullstack

---

## CONTEXT

The majority of Opollo's users are on mobile phones. A well-designed,
consistently placed back button is critical UX — especially for Diaspora
buyers browsing from abroad on mobile data. This prompt creates a polished,
accessible back button component and places it in every location across both
the public site and admin dashboard where navigation depth exists.

Read the entire prompt before writing any code. Do not recreate existing files.

---

## ABSOLUTE RULES

1. Strictly typed — no `any`.
2. CSS variable tokens only — no hardcoded hex colours.
3. Mobile-first. The back button must be tap-friendly — minimum 44x44px
   touch target (Apple HIG standard).
4. The component must handle both browser history navigation AND
   explicit href fallback — if there is no history to go back to
   (user arrived via direct link), it navigates to the fallback href.
5. Never use plain `router.back()` without a fallback — on direct links
   from WhatsApp shares or Google, there is no history stack.
6. All animations use CSS transitions via Tailwind — no additional
   animation libraries needed.
7. The back button must respect both light and dark themes via CSS variables.

---

## COMPONENT: `components/ui/BackButton.tsx`

**CREATE THIS FILE.**

```typescript
"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

type BackButtonVariant = "default" | "floating" | "minimal" | "pill"

type BackButtonProps = {
  // Fallback href if no browser history exists
  // Always provide this — never rely on history alone
  href: string

  // Optional label — if not provided, shows icon only on mobile
  label?: string

  // Visual variant
  variant?: BackButtonVariant

  // Additional className
  className?: string

  // Override the icon — defaults to ArrowLeft
  // Useful for modals where X makes more semantic sense
  iconOnly?: boolean
}
```

### Variants spec:

```typescript
// VARIANT: "default" (used on most pages)
// ─────────────────────────────────────────
// Background: --color-bg-secondary
// Border: 1px solid --color-border
// Text: --color-text-secondary
// Hover: border-color → --color-border-accent, text → --color-accent
// Icon: ArrowLeft (16px)
// Label: shows on all screen sizes
// Padding: 0.5rem 1rem
// Border-radius: --radius-md
// Transition: all 150ms ease
// Min height: 44px (tap target)
//
// Example:
// ← Back to Properties

// VARIANT: "floating" (used on detail pages over images)
// ─────────────────────────────────────────────────────
// Position: fixed top-4 left-4, z-50
// Background: rgba(0,0,0,0.55) with backdrop-blur-sm
// Border: 1px solid rgba(255,255,255,0.15)
// Text + icon: white
// Hover: background → rgba(0,0,0,0.75)
// Border-radius: 9999px (full pill)
// Shows icon + short label on mobile
// Min height: 44px, min width: 44px
// Only used when overlaid on a full-bleed image/hero
//
// Example: ← Back

// VARIANT: "minimal" (used inside admin panels, modals, drawers)
// ──────────────────────────────────────────────────────────────
// No background, no border
// Text: --color-text-muted
// Icon: ArrowLeft (14px)
// Hover: text → --color-text-primary
// Underline on hover
// Padding: 0.25rem 0
// Transition: color 150ms ease
//
// Example: ← Back

// VARIANT: "pill" (used in breadcrumb-style navigation)
// ──────────────────────────────────────────────────────
// Background: --color-accent-muted
// Text: --color-accent
// Border: none
// Border-radius: 9999px
// Icon: ArrowLeft (14px)
// Padding: 0.35rem 0.85rem
// Hover: background → slightly more opaque accent-muted
// Font-size: 0.8rem
// Font-weight: 500
//
// Example: ← Properties
```

### Implementation:

```typescript
export function BackButton({
  href,
  label = "Back",
  variant = "default",
  className,
  iconOnly = false,
}: BackButtonProps) {
  const router = useRouter()

  function handleBack() {
    // Check if there is a history entry to go back to
    // window.history.length > 1 means there is history
    // However this is unreliable for direct links — always use fallback
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push(href)
    }
  }

  const baseClasses = "inline-flex items-center gap-2 cursor-pointer transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"

  const variantClasses: Record<BackButtonVariant, string> = {
    default:  "min-h-[44px] px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:border-[var(--color-border-accent)] hover:text-[var(--color-accent)]",
    floating: "fixed top-4 left-4 z-50 min-h-[44px] min-w-[44px] px-3 py-2 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 text-white text-sm font-medium hover:bg-black/75",
    minimal:  "min-h-[44px] py-1 text-[var(--color-text-muted)] text-sm hover:text-[var(--color-text-primary)] hover:underline",
    pill:     "min-h-[44px] px-[0.85rem] py-[0.35rem] rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] text-[0.8rem] font-medium hover:bg-[var(--color-accent-muted)]/80",
  }

  return (
    <button
      onClick={handleBack}
      aria-label={`Go back${label ? ` to ${label}` : ""}`}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      <ArrowLeft size={variant === "minimal" || variant === "pill" ? 14 : 16} />
      {!iconOnly && <span>{label}</span>}
    </button>
  )
}
```

---

## PLACEMENTS — PUBLIC SITE

Place the back button in every location listed below. Use the exact variant
and label specified. Do not deviate from variant choices — they are deliberate.

---

### 1. Property Detail Page
**File:** `app/(site)/properties/[slug]/page.tsx`

```typescript
// PLACEMENT: Top of page, above the image gallery
// VARIANT: "default"
// LABEL: "Back to Properties"
// HREF: "/properties"
// Position: top-left, above the hero gallery, full-width mobile / auto desktop
// Mobile: full-width button row, left-aligned icon
// Desktop: left-aligned, auto width

<BackButton href="/properties" label="Back to Properties" variant="default" />
```

**AND** a floating variant for when the user has scrolled into the image gallery:

```typescript
// PLACEMENT: Floating over the hero image (appears when user scrolls past
//            the top back button — use IntersectionObserver)
// VARIANT: "floating"
// LABEL: "Back"
// HREF: "/properties"
// Only visible when the default back button above has scrolled out of view

// Implementation:
// const topButtonRef = useRef<HTMLDivElement>(null)
// const [showFloating, setShowFloating] = useState(false)
// useEffect → IntersectionObserver on topButtonRef
// When topButton leaves viewport → setShowFloating(true)
// When it re-enters → setShowFloating(false)
// {showFloating && <BackButton variant="floating" href="/properties" label="Back" />}
```

---

### 2. Properties Listing Page (after filtering/searching)
**File:** `app/(site)/properties/page.tsx`

```typescript
// PLACEMENT: Top-left of the page, above the filter bar
// VARIANT: "default"
// LABEL: "Home"
// HREF: "/"
// Only render if the page has active filters or a search query
// (If user is on the base /properties with no filters, no back button needed —
//  they got here from the nav, not from a deep link)
// Show condition: searchParams has at least one non-empty value

const hasActiveFilters = Object.values(searchParams).some(Boolean)
{hasActiveFilters && <BackButton href="/" label="Home" variant="default" />}
```

---

### 3. Contact Page
**File:** `app/(site)/contact/page.tsx`

```typescript
// PLACEMENT: Top of page, above the heading
// VARIANT: "minimal"
// LABEL: "Back"
// HREF: "/"
```

---

### 4. Any Future Public Page Added
Apply the rule: **if the page is more than 1 level deep from home, it gets a back button.** Use `variant="default"` unless overlaid on a full-bleed image (use `"floating"`) or inside a tight header (use `"minimal"`).

---

## PLACEMENTS — ADMIN DASHBOARD

---

### 5. Property Edit Page
**File:** `app/(admin)/dashboard/properties/[id]/edit/page.tsx`

```typescript
// PLACEMENT: Top of page, in the page header bar (left side)
// VARIANT: "minimal"
// LABEL: "Back to Properties"
// HREF: "/admin/dashboard/properties"

// Header bar layout:
// [← Back to Properties]    [Property Title]    [Save Draft] [Publish]
```

---

### 6. Property Detail View (admin read-only)
**File:** `app/(admin)/dashboard/properties/[id]/page.tsx`

```typescript
// PLACEMENT: Top of page header bar, left side
// VARIANT: "minimal"
// LABEL: "Back to Properties"
// HREF: "/admin/dashboard/properties"
```

---

### 7. New Property Form
**File:** `app/(admin)/dashboard/properties/new/page.tsx`

```typescript
// PLACEMENT: Top of page header bar, left side
// VARIANT: "minimal"
// LABEL: "Back to Properties"
// HREF: "/admin/dashboard/properties"
// Note: BackButton here should trigger the "unsaved changes" warning
//       if the form is dirty (isDirty from react-hook-form)
//       Instead of router.back(), call the unsaved changes modal
//       Pass an optional onBeforeNavigate callback prop:

// Add optional prop to BackButton:
// onBeforeNavigate?: () => Promise<boolean>
// If provided, call it before navigating
// If it returns false, cancel the navigation
// If it returns true, proceed

// In the new property page:
// <BackButton
//   href="/admin/dashboard/properties"
//   label="Back to Properties"
//   variant="minimal"
//   onBeforeNavigate={async () => {
//     if (!isDirty) return true
//     return await showUnsavedChangesModal() // returns true if user confirms
//   }}
// />
```

---

### 8. Inquiry Detail Page
**File:** `app/(admin)/dashboard/inquiries/[id]/page.tsx`

```typescript
// PLACEMENT: Top of page header bar, left side
// VARIANT: "minimal"
// LABEL: "Back to Inquiries"
// HREF: "/admin/dashboard/inquiries"
```

---

### 9. Users Management Page → User Detail (if added later)
**File:** `app/(admin)/dashboard/users/[id]/page.tsx`

```typescript
// PLACEMENT: Top of page header bar, left side
// VARIANT: "minimal"
// LABEL: "Back to Users"
// HREF: "/admin/dashboard/users"
```

---

### 10. Admin Login Page (back to site)
**File:** `app/(admin)/login/page.tsx`

```typescript
// PLACEMENT: Top-left of the login card or above it
// VARIANT: "minimal"
// LABEL: "Back to Site"
// HREF: "/"
// Note: This gives Taylor a way back to the public site from the login page
//       in case they landed there accidentally
```

---

### 11. Saved Properties Drawer
**File:** `components/property/SavedPropertiesDrawer.tsx`

```typescript
// PLACEMENT: Top of the drawer, left side of the drawer header
// VARIANT: "minimal"
// LABEL: "Close"  ← semantic difference: drawer "back" is "close"
// HREF: "/"  ← not used, close the drawer instead
// Override handleBack to call the drawer's onClose prop instead of routing

// Add prop to BackButton:
// onClick?: () => void
// If onClick is provided, call it instead of router navigation

// <BackButton
//   href="/"
//   label="Close"
//   variant="minimal"
//   onClick={onClose}
// />
```

---

### 12. Mobile Navigation Drawer / Menu (if exists)
**File:** `components/layout/Navbar.tsx` (mobile menu drawer)

```typescript
// PLACEMENT: Top of the mobile menu drawer
// VARIANT: "minimal"
// LABEL: "Close Menu"
// onClick: close the drawer
// Same pattern as Task 11 — onClick override
```

---

## UPDATED `BackButton` PROPS (final merged type)

After all placements, the final component props are:

```typescript
type BackButtonProps = {
  href: string                           // fallback navigation target
  label?: string                         // display label (default: "Back")
  variant?: BackButtonVariant            // "default" | "floating" | "minimal" | "pill"
  className?: string
  iconOnly?: boolean                     // show icon only, no label
  onClick?: () => void                   // override: call this instead of navigating
  onBeforeNavigate?: () => Promise<boolean>  // async guard: return false to cancel
}

// Navigation priority:
// 1. If onClick provided → call onClick, do not navigate
// 2. If onBeforeNavigate provided → await it, if false cancel, if true navigate
// 3. Navigate: router.back() if history exists, else router.push(href)
```

---

## MOBILE-SPECIFIC CONSIDERATIONS

These rules apply to every instance of the back button across the app:

```
Touch target: minimum 44x44px on all variants — enforce with min-h-[44px] min-w-[44px]

Tap feedback: add active:scale-95 to all variants for tactile press feel

Label visibility:
  - "default" variant: always show label
  - "floating" variant: show label on mobile (it's just "Back" — short enough)
  - "minimal" variant: show label on all sizes
  - "pill" variant: show label on all sizes

Placement on mobile:
  - Never place back button in the far top-right corner — thumbs can't reach it
  - Always left-aligned or top-left — natural thumb zone on mobile
  - On property detail: the default back button at the very top
    collapses to full-width on mobile for easy tapping

Z-index:
  - "floating" variant: z-50 — must appear above image galleries and overlays
  - All others: default z-index in flow
```

---

## ACCESSIBILITY

```typescript
// Every BackButton must have:
// aria-label={`Go back to ${label}`}
// role="button" (implicit on <button>)
// tabIndex={0} (implicit on <button>)
// focus-visible ring using --color-accent
// keyboard: Enter and Space both trigger navigation (implicit on <button>)

// Do NOT use <a> or <div> for this component — always <button>
// Using router.push inside a button is correct and accessible
```

---

## BUILD ORDER

1. Create `components/ui/BackButton.tsx` with all variants and full props
2. Add `onBeforeNavigate` and `onClick` prop handling
3. Add `active:scale-95` press animation to all variants
4. Place on `app/(site)/properties/[slug]/page.tsx` — both default and floating
5. Place on `app/(site)/properties/page.tsx` — conditional on active filters
6. Place on `app/(site)/contact/page.tsx`
7. Place on `app/(admin)/login/page.tsx`
8. Place on `app/(admin)/dashboard/properties/[id]/edit/page.tsx`
9. Place on `app/(admin)/dashboard/properties/[id]/page.tsx`
10. Place on `app/(admin)/dashboard/properties/new/page.tsx` — with onBeforeNavigate
11. Place on `app/(admin)/dashboard/inquiries/[id]/page.tsx`
12. Place on `app/(admin)/dashboard/users/[id]/page.tsx` (future-proof scaffold)
13. Update `components/property/SavedPropertiesDrawer.tsx` — onClick close
14. Update `components/layout/Navbar.tsx` — mobile menu close
15. Verify every instance is keyboard accessible and has correct aria-label
16. Verify every instance has a valid `href` fallback (never an empty string)
17. Test on mobile viewport (375px) — confirm all touch targets are 44px minimum

---

## WHAT SUCCESS LOOKS LIKE

- A user who lands on a property detail page from a WhatsApp link taps
  "← Back to Properties" and lands on the listings grid — not a blank page
  or browser error because there was no history

- As the user scrolls into the property gallery, the floating back button
  appears in the top-left overlaid on the image — always accessible

- On mobile, every back button is easy to tap with a thumb — left-aligned,
  minimum 44px height, with a satisfying press animation

- Admin navigating deep into a property edit form can always get back to the
  properties list — and if the form is dirty, they see the unsaved changes
  warning before anything is lost

- The component handles three navigation scenarios cleanly:
  1. Browser back (history exists)
  2. Router push to fallback (no history — direct link)
  3. Custom onClick (drawers, modals, close actions)

- Every instance is accessible: keyboard navigable, screen-reader labelled,
  focus ring visible
