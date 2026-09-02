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
- **Media Asset Processing**: Local upload handler + Cloudinary integration for property image galleries and virtual tour videos.
- **Inquiry Management Hub**: Track customer inquiries, review message details, mark status, and follow up directly.
- **Role-Based Access Control (RBAC)**: Enforced via NextAuth JWT sessions and middleware proxies for Super Admin, Admin, and Viewer roles.
- **SEO & Indexing Control**: Built-in sitemap generation, structured JSON-LD data, robots.txt, and IndexNow search engine ping integration.

---

## 🏗️ Architecture & Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router, Server Components & Actions with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables (`app/globals.css`)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with **PostgreSQL** database engine (for both local development and production)
- **Secret Management**: [Doppler](https://www.doppler.com/) CLI integration for environment secret injection
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider with JWT Strategy)
- **UI Components & Icons**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/), [Sonner](https://sonner.emilkowal.si/)
- **Media & Geocoding**: Cloudinary API, Nominatim OpenStreetMap Proxy

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables / Doppler
Set up your PostgreSQL database connection URL in `.env` (or via Doppler secret manager):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/aura_real_estate_db"
NEXTAUTH_SECRET="aura-luxury-portfolio-secret-key-2026"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="+2347000000000"
```

If using **Doppler**:
```bash
# Link project configuration
doppler setup

# Environment secrets are automatically injected into pnpm dev, pnpm build, and pnpm prisma:* commands
```

### 3. Initialize & Seed Database
Sync the Prisma schema to PostgreSQL and seed initial records (Super Admin user, luxury properties with media and video tours):
```bash
# Push database schema to PostgreSQL
pnpm prisma:push

# Seed demo users & sample properties
pnpm prisma:seed
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
│   ├── api/                    # API endpoints (Auth, Admin, Properties, Inquiries, Media)
│   ├── globals.css             # Theme tokens (Emerald Green luxury palette)
│   └── layout.tsx              # Root layout + Providers + JSON-LD
│
├── components/
│   ├── admin/                  # Dashboard tables, forms, sidebar, management UI
│   ├── layout/                 # Navbar, Footer, Navigation
│   ├── property/               # Cards, grids, filters, maps, detail views
│   ├── sections/               # Homepage hero, services, packages, testimonials
│   └── ui/                     # Reusable buttons, modals, logo, toasts
│
├── context/                    # Currency & Bookmarks React Contexts
├── hooks/                      # Custom hooks (React Query, currency rates, media, search)
├── lib/                        # Prisma client, auth config, email, whatsapp, permissions
├── metadata/                   # Site config & property fallback listings
├── prisma/                     # PostgreSQL database schema & seed scripts
└── public/                     # Static images, OG graphics, property media assets
```

---

## 🔐 Deployment & Environment Notes

- **PostgreSQL Database Engine**: The application requires a PostgreSQL database instance for both local development and production environments (e.g. local PostgreSQL, Supabase, Neon, or Railway).
- **Doppler Integration**: Secrets can be managed centrally using Doppler CLI (`doppler run --`), which automatically injects environment variables during `pnpm dev`, `pnpm build`, and Prisma commands.
- **Production Deployment**: To deploy to Vercel or Netlify, supply the PostgreSQL `DATABASE_URL` connection string and `NEXTAUTH_SECRET` environment variables.

---

© 2026 **Aura Luxury Properties** — Full-Stack Portfolio Display Project.
