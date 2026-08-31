# 🏰 Aura Luxury Properties — Portfolio Display Application

> **📌 Portfolio Project Notice**: This application is a full-stack **Portfolio Display & Showcase Project** designed to demonstrate a production-grade, metadata-driven luxury real estate platform. All operations are fully functional and unrestricted for demonstration purposes.

---

## 🔑 Admin Dashboard Login Credentials

Anyone reviewing this portfolio showcase can log into the management console to explore property creation, user role administration, inquiry tracking, and system settings.

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@auraluxury.com` | `PortfolioDemo2026!` | Full System & User Management |
| **Admin / Agent** | `agent@auraluxury.com` | `AgentDemo2026!` | Property CRUD & Inquiry Access |

**Dashboard Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## ✨ Features & Capabilities

### 🌐 Public Showcase Portal
- **Metadata-Driven Brand Architecture**: Site identity, contact details, package options, and hero copy are managed in centralized, type-safe metadata (`metadata/site.ts`).
- **Dynamic Multi-Currency System**: Real-time price conversion between Nigerian Naira (NGN), British Pound (GBP), US Dollar (USD), Canadian Dollar (CAD), Euro (EUR), and UAE Dirham (AED) with automatic client-side caching.
- **Advanced Property Search & Filter**: Filter luxury duplexes, apartments, commercial spaces, and land by location, price, listing type, bedrooms, and status.
- **Interactive Mapping**: Leaflet and OpenStreetMap integration with server-side Nominatim geocoding proxy for privacy and reliability.
- **Inquiry & Direct Messaging**: Built-in inquiry modals with pre-filled WhatsApp link generator and automated email dispatch capabilities via Resend API.
- **Client Bookmarks System**: Bookmark properties with persistent local storage and expiration controls.
- **Theme Engine**: Emerald Green & Obsidian Luxury design system with seamless light/dark mode switching via `next-themes`.

### 🛡️ Management Dashboard Portal
- **Analytics Overview**: High-level metrics for active listings, total inquiries, featured properties, and quick management links.
- **Property Lifecycle CRUD**: Create, edit, feature, pin, or delete property listings with automated slug generation and coordinate lookup.
- **Media Asset Processing**: Local fallback upload handler + Cloudinary integration for property image galleries and virtual tour videos.
- **Inquiry Management Hub**: Track customer inquiries, review message details, mark status, and follow up directly.
- **Role-Based Access Control (RBAC)**: Enforced via NextAuth JWT sessions and middleware proxies for Super Admin, Admin, and Viewer roles.
- **SEO & Indexing Control**: Built-in sitemap generation, structured JSON-LD data, robots.txt, and IndexNow search engine ping integration.

---

## 🏗️ Architecture & Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router, Server Components & Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables (`app/globals.css`)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) (SQLite default for zero-config local setup; compatible with PostgreSQL / MySQL)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider with JWT Strategy)
- **UI Components & Icons**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/), [Sonner](https://sonner.emilkowal.si/)
- **Media & Geocoding**: Cloudinary API, Nominatim OpenStreetMap Proxy

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` (or create a `.env` file in the root directory):
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="portfolio-demo-secret-key-2026"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="+2347000000000"
```

### 3. Initialize & Seed Database
Run Prisma migrations and populate the database with demo listings and admin credentials:
```bash
# Push database schema
npx prisma db push

# Seed demo users & sample properties
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── app/
│   ├── (site)/                 # Public pages (Home, Properties, Contact)
│   ├── admin/                  # Admin dashboard & login routes
│   ├── api/                    # API endpoints (Auth, Properties, Inquiries, Rates)
│   ├── globals.css             # Theme tokens (Emerald Green luxury palette)
│   └── layout.tsx              # Root layout + Providers + JSON-LD
│
├── components/
│   ├── admin/                  # Dashboard tables, forms, management UI
│   ├── layout/                 # Navbar, Footer, Navigation
│   ├── property/               # Cards, grids, filters, maps, detail views
│   ├── sections/               # Homepage hero, services, packages, testimonials
│   └── ui/                     # Reusable buttons, modals, logo, toasts
│
├── context/                    # Currency & Bookmarks React Contexts
├── hooks/                      # Custom hooks (currency rates, media, search)
├── lib/                        # Prisma client, auth config, email, whatsapp, permissions
├── metadata/                   # Site config & property fallback listings
├── prisma/                     # Database schema & seed scripts
└── public/                     # Static images, OG graphics, logo icon
```

---

## 🔐 Deployment & Environment Notes

- **Zero External Dependency Mode**: Out of the box, the app runs entirely locally using SQLite and mock upload fallbacks if Resend or Cloudinary API keys are not provided.
- **Production Deployment**: To deploy to Vercel, set `DATABASE_URL` (e.g. Supabase PostgreSQL or PlanetScale MySQL), update `NEXTAUTH_SECRET`, and deploy.

---

© 2026 **Aura Luxury Properties** — Full-Stack Portfolio Display Project.ient/designer updates `metadata/site.ts` and deploys
- Zero developer involvement for content updates

---

**Production-grade scaffold ready for real client deployment.**
