# Premium Real Estate Website - Next.js 16+ Full Stack

Production-ready, dark/light-theme real estate website scaffold for a Nigerian real estate company. **Metadata-driven architecture** ensures all client-specific content lives in configuration files, not hardcoded in JSX.

## ✨ Features

- **Metadata-Driven Design**: All content (company name, contact info, services, properties, testimonials) edits in `metadata/site.ts` and `metadata/properties.ts`
- **Dark/Light Theme**: Full support with CSS variables for seamless theme switching
- **Premium UI**: Cormorant Garamond display font paired with DM Sans body font
- **Scroll Animations**: Framer Motion scroll reveals on all sections
- **WhatsApp Integration**: Floating button + inline variant with pre-filled messages
- **Mobile Responsive**: Works perfectly at 375px minimum width
- **Properties Listing**: Display featured and all properties with enquiry buttons
- **API Scaffold**: Ready-to-wire backend routes for contact, enquiries, and listings
- **Type-Safe**: Full TypeScript with zero `any` types

## 🚀 Quick Start

### Install Dependencies
```bash
pnpm install
```

### Development
```bash
pnpm dev
```
Visit http://localhost:3000

### Production Build
```bash
pnpm build
pnpm start
```

## 📝 Metadata Configuration

### `metadata/site.ts` — Full Brand Config
Contains **ALL** client-specific content:
- Company name, tagline, description
- Contact info (WhatsApp, email, phone, address, socials)
- Hero headline & CTA buttons
- Services list
- Pricing packages
- Why Us section
- Process steps
- Testimonials
- CTA section text

**To rebrand the site, only edit this file.**

### `metadata/properties.ts` — Property Listings
Add or edit properties in this array. Set `featured: true` to show on homepage.

## 🎨 Theme System

Edit CSS variables in `app/globals.css` to rebrand colors, fonts, and spacing:
```css
:root {
  --color-accent: #B8860B;           /* Primary brand colour (gold) */
  --color-bg-primary: #ffffff;       /* Light mode background */
  /* ... more tokens */
}

[data-theme='dark'] {
  --color-bg-primary: #0f0f0f;       /* Dark mode background */
  /* ... more tokens */
}
```

## 📁 Project Structure

```
├── app/
│   ├── api/                    # Backend routes (scaffolded)
│   ├── layout.tsx              # Root layout + ThemeProvider
│   ├── page.tsx                # Homepage
│   ├── properties/page.tsx     # Properties listing
│   └── globals.css             # Theme tokens (CSS variables)
│
├── components/
│   ├── layout/                 # Navbar, Footer
│   ├── sections/               # All homepage sections
│   └── ui/                     # Reusable components
│
├── metadata/
│   ├── site.ts                 # Brand config (edit to rebrand)
│   └── properties.ts           # Property listings
│
├── types/index.ts              # TypeScript interfaces
└── tailwind.config.ts          # Tailwind + CSS variable config
```

## 🌐 Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage with all sections |
| `/properties` | All properties grid |
| `/api/contact` | Contact form endpoint (scaffolded) |
| `/api/enquiry` | Property enquiry endpoint (scaffolded) |
| `/api/listings` | Get all properties endpoint (scaffolded) |

## ✅ What's Included

✓ 8 homepage sections (Hero, Services, Properties, WhyUs, Packages, Process, Testimonials, CTA)
✓ Properties listing page
✓ Dark/light theme with smooth transitions
✓ Navbar with mobile hamburger menu
✓ Footer with socials and links
✓ WhatsApp integration (floating + inline buttons)
✓ Scroll animations on all sections
✓ Fully responsive (375px minimum)
✓ TypeScript strict mode
✓ API route scaffolds (ready to wire backend)
✓ Placeholder SVG images

## 🚀 Deploy

### Vercel
```bash
pnpm build
git push  # Auto-deploys via Vercel integration
```

### Self-Hosted
```bash
pnpm build
pnpm start  # Runs on port 3000
```

## 🔧 Key Technologies

- **Framework**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS v4 + CSS variables
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Forms**: react-hook-form
- **Icons**: lucide-react
- **TypeScript**: Strict mode

## 📞 WhatsApp Integration

All enquiry buttons generate pre-filled WhatsApp messages using `generateWhatsAppUrl()` helper. Messages are configured in metadata for each property.

## 🔐 Production Notes

- No database integrated yet (use API routes as scaffolds)
- No email service integrated yet (add Resend, Nodemailer, etc. to `/api/contact`)
- No CRM integrated yet (add to `/api/enquiry`)
- All placeholder content in metadata files ready to swap
- Images use Next.js Image component with optimization

## 📖 Architecture Philosophy

**Every piece of client-specific content lives in `metadata/` directory, not hardcoded in components.** This means:
- Developer changes JSX structure
- Client/designer updates `metadata/site.ts` and deploys
- Zero developer involvement for content updates

---

**Production-grade scaffold ready for real client deployment.**
