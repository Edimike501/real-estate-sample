# Setup & Deployment Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```
Open http://localhost:3000 in your browser.

### 3. Test Dark Mode
Click the sun/moon icon in the top navbar to switch between light and dark modes.

## 📝 Customization

### Change Company Name, Contact Info, etc.
**File**: `metadata/site.ts`
```typescript
export const siteMetadata: SiteConfig = {
  company: {
    name: "Your Company Name",  // ← Change here
    tagline: "Your tagline",
    description: "Your description",
    // ... more fields
  },
  contact: {
    whatsapp: "+234XXXXXXXXXX",  // ← WhatsApp number
    email: "your@email.com",
    phone: "+234 000 000 0000",
    address: "Your address",
    // ... social media links
  },
  // ... rest of configuration
}
```
**No code rebuild needed** — changes appear immediately in dev server.

### Add or Edit Properties
**File**: `metadata/properties.ts`
```typescript
export const properties: Property[] = [
  {
    id: "prop-001",
    title: "Your Property Title",
    location: "Location",
    price: "₦XX,XXX,XXX",
    type: "House",  // Land | House | Commercial | Apartment
    status: "Available",  // Available | Sold | Under Offer
    bedrooms: 3,
    bathrooms: 3,
    size: "280 sqm",
    image: "/images/properties/prop-001.jpg",
    featured: true,  // Show on homepage
    description: "Your property description",
    whatsappMessage: "Pre-filled WhatsApp message",
  },
  // Add more properties...
]
```

### Change Colors and Fonts
**File**: `app/globals.css`
```css
:root {
  /* Change brand color */
  --color-accent: #0066FF;  /* Was #B8860B (gold) */
  
  /* Change fonts */
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'DM Sans', sans-serif;
  
  /* Light mode colors */
  --color-bg-primary: #ffffff;
  --color-text-primary: #1a1a1a;
  /* ... more colors */
}

/* Dark mode colors */
[data-theme='dark'] {
  --color-bg-primary: #0f0f0f;
  --color-text-primary: #e8e2d4;
  /* ... more colors */
}
```

## 🏗️ Project Structure

```
.
├── app/
│   ├── api/                      # Backend endpoints
│   │   ├── contact/route.ts      # Contact form (TODO: wire email)
│   │   ├── enquiry/route.ts      # Property enquiry (TODO: wire CRM)
│   │   └── listings/route.ts     # Returns all properties
│   ├── layout.tsx                # Root layout + theme provider
│   ├── page.tsx                  # Homepage
│   ├── properties/page.tsx       # Properties listing
│   └── globals.css               # Theme tokens & CSS variables
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Top navigation
│   │   └── Footer.tsx            # Footer with links
│   ├── sections/
│   │   ├── Hero.tsx              # Hero section
│   │   ├── Services.tsx          # Services grid
│   │   ├── Properties.tsx        # Featured properties
│   │   ├── WhyUs.tsx             # Why choose us
│   │   ├── Packages.tsx          # Pricing packages
│   │   ├── Process.tsx           # 4-step process
│   │   ├── Testimonials.tsx      # Client testimonials
│   │   └── CTA.tsx               # Call-to-action
│   └── ui/
│       ├── AnimatedSection.tsx   # Scroll reveal wrapper
│       ├── ThemeToggle.tsx       # Dark/light toggle
│       ├── WhatsAppButton.tsx    # WhatsApp CTA button
│       ├── PropertyCard.tsx      # Property card component
│       └── SectionLabel.tsx      # Section heading
│
├── metadata/
│   ├── site.ts                   # ← EDIT TO REBRAND SITE
│   └── properties.ts             # ← EDIT TO ADD PROPERTIES
│
├── types/index.ts                # TypeScript interfaces
├── lib/utils.ts                  # Utility functions
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── package.json                  # Dependencies
└── README.md                      # Project documentation
```

## 📱 Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage with all sections |
| `/properties` | All properties listing |
| `/api/contact` | Contact form endpoint |
| `/api/enquiry` | Property enquiry endpoint |
| `/api/listings` | Returns all properties |

## 🔧 Available Commands

```bash
# Development
pnpm dev            # Start dev server (http://localhost:3000)

# Build
pnpm build          # Build for production

# Production
pnpm start          # Run production server

# Linting
pnpm lint           # Run ESLint

# Type checking
pnpm check          # Run TypeScript check
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
# Visit https://vercel.com/new
# Select your GitHub repository
# Click Deploy

# 3. Auto-deployment
# Every push to main will auto-deploy
```

### Self-Hosted (VPS, AWS, DigitalOcean, etc.)
```bash
# 1. Build
pnpm build

# 2. Install production dependencies
pnpm install --prod

# 3. Start production server
pnpm start

# Server runs on port 3000
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 🔐 Backend Integration

### Contact Form
**File**: `app/api/contact/route.ts`
```typescript
// TODO: Wire email service
// Suggested: Resend, Nodemailer, SendGrid
// Receives: { name, email, phone, message }
// Should: Send email to admin
```

### Property Enquiry
**File**: `app/api/enquiry/route.ts`
```typescript
// TODO: Wire CRM
// Suggested: HubSpot, Pipedrive, custom database
// Receives: { name, phone, propertyId, message }
// Should: Create lead/inquiry record
```

### Property Listings
**File**: `app/api/listings/route.ts`
```typescript
// TODO: Replace with database query
// Currently: Returns from metadata/properties.ts
// Should: Query property database (Supabase, MongoDB, etc.)
```

## 🎨 Customization Examples

### Example 1: Change Primary Color
```css
/* app/globals.css */
:root {
  --color-accent: #FF6B35;  /* Changed from #B8860B */
}
```

### Example 2: Change Hero Headline
```typescript
// metadata/site.ts
hero: {
  headline: "Discover Your Dream",
  headlineAccent: "Property Today",  // Changed
  subtext: "Premium real estate solutions...",
  // ...
}
```

### Example 3: Add New Service
```typescript
// metadata/site.ts
services: {
  items: [
    // ... existing services
    {
      icon: "Heart",
      title: "New Service",
      description: "Description of new service",
    },
  ],
}
```

### Example 4: Add New Property
```typescript
// metadata/properties.ts
export const properties: Property[] = [
  // ... existing properties
  {
    id: "prop-007",
    title: "Luxury Penthouse",
    location: "Victoria Island, Lagos",
    price: "₦120,000,000",
    type: "Apartment",
    status: "Available",
    bedrooms: 4,
    bathrooms: 4,
    size: "350 sqm",
    image: "/images/properties/prop-007.jpg",
    featured: true,
    description: "Luxury penthouse with ocean view",
    whatsappMessage: "Hi, I'm interested in the Luxury Penthouse",
  },
]
```

## 🌙 Dark/Light Mode

The site automatically supports dark mode. Users can toggle via:
1. Sun/Moon icon in the navbar
2. System preferences (if `enableSystem: true` in `next-themes`)

All colors automatically switch via CSS variables.

## 📞 WhatsApp Integration

All WhatsApp buttons are pre-configured with:
- Phone number from `metadata/site.ts`
- Pre-filled messages for each property
- WhatsApp web URL generation via `generateWhatsAppUrl()` helper

## 🔍 Environment Variables (Optional)

Create `.env.local` for sensitive data:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
DATABASE_URL=your_database_url
EMAIL_API_KEY=your_email_service_key
CRM_API_KEY=your_crm_api_key
```

## 🚨 Common Issues

### Issue: "pnpm: command not found"
**Solution**: Install pnpm globally
```bash
npm install -g pnpm
```

### Issue: Port 3000 already in use
**Solution**: Use different port
```bash
pnpm dev -- -p 3001
```

### Issue: Changes not appearing
**Solution**: Clear `.next` folder
```bash
rm -rf .next
pnpm dev
```

### Issue: Images not loading
**Solution**: Ensure images are in `/public/images/`
```bash
mkdir -p public/images/properties
# Add your images there
```

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)

## 💡 Tips

1. **Hot Reload**: Metadata changes appear immediately without rebuild
2. **Mobile Testing**: Use Chrome DevTools device emulation
3. **Performance**: Use Next.js Image component for all images
4. **SEO**: Update metadata in `app/layout.tsx`
5. **Analytics**: Add Google Analytics to `app/layout.tsx`

## ✅ Pre-Deployment Checklist

- [ ] Update all metadata in `metadata/site.ts`
- [ ] Add/verify all properties in `metadata/properties.ts`
- [ ] Customize colors in `app/globals.css`
- [ ] Test dark mode thoroughly
- [ ] Test on mobile (375px+)
- [ ] Replace placeholder images
- [ ] Wire backend endpoints (`/api/` routes)
- [ ] Test contact form
- [ ] Test WhatsApp buttons
- [ ] Update SEO metadata
- [ ] Set up analytics
- [ ] Build and test production: `pnpm build && pnpm start`
- [ ] Deploy to hosting

## 🎉 You're Ready!

The site is production-ready. Customize with metadata files and deploy!

