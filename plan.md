import { MetadataRoute } from "next";

// Placeholder for your actual data fetching logic
async function getActiveProperties() {
// const res = await fetch('https://api.../properties');
// return res.json();
return [{ slug: "luxury-4-bed-detached-villa-lekki" }];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.opolloluxuries.com";

// Base routes
const routes = ["", "/properties", "/contact"].map((route) => ({
url: ${baseUrl}${route},
lastModified: new Date().toISOString(),
changeFrequency: "weekly" as const,
priority: route === "" ? 1.0 : 0.8
}));

try {
const properties = await getActiveProperties();
const propertyRoutes = properties.map((prop) => ({
url: ${baseUrl}/properties/${prop.slug},
lastModified: new Date().toISOString(), // Best practice: use actual prop.updatedAt if available
changeFrequency: "daily" as const,
priority: 0.7
}));

    return [...routes, ...propertyRoutes];

} catch (error) {
console.error("Failed to generate dynamic property routes for sitemap", error);
return [...routes];
}
}

implement this in my app

then for the below feature, make sure to comment the social media part(sameAs) but keepo them where they're supposed to be, because no social handles for now

This is exactly how you turn standard metadata into an enterprise-grade programmatic SEO engine. Since you only have the homepage "", /properties, and /contact right now, this blueprint will configure your global entities immediately and lay down the exact groundwork for when you add dynamic listing and blog routes down the line.

⚙️ The Architectural Blueprint
Before generating the schemas, here is the architectural breakdown of how these schemas map across your current pages, and how they will scale to future pages.

📁 app/
│
├── layout.tsx ───► [GLOBAL SETUP] Organization & WebSite Schema
│
├── page.tsx ───► [HOMEPAGE] RealEstateAgent Schema
│
├── contact/
│ └── page.tsx ──► [CONTACT PAGE] LocalBusiness Schema Extension
│
└── properties/
├── page.tsx ──► [DIRECTORY] CollectionPage Schema
│
└── [slug]/ ──► (FUTURE) SingleFamilyResidence / Apartment + Offer Schema
📄 Complete Implementation Code
Here is the exact code structure to build out. Everything is written using pure TypeScript and matches modern Next.js conventions.

1. The Dynamic Wrapper Component
   Create this component first. It handles injecting the JSON objects cleanly into the HTML <head> segment without muddying your server rendering context.

TypeScript
// components/seo/JsonLd.tsx
import React from "react";

interface JsonLdProps {
schema: Record<string, any>;
}

export default function JsonLd({ schema }: JsonLdProps) {
return (
<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
);
} 2. Global Layout Changes (app/layout.tsx)
This handles the Organization identity and the search box configuration (WebSite). It establishes the root authority for "Opollo Luxury Properties Ltd".

TypeScript
// Place this inside your existing app/layout.tsx inside the <body> tag, or near your providers
import JsonLd from "@/components/seo/JsonLd";
import { siteMetadata } from "@/metadata/site";

const globalOrganizationSchema = {
"@context": "https://schema.org",
"@graph": [
{
"@type": "Organization",
"@id": "https://www.opolloluxuries.com/#organization",
"name": "Opollo Luxury Properties Ltd",
"url": "https://www.opolloluxuries.com",
"logo": "https://www.opolloluxuries.com/icon.png",
"sameAs": [
"https://www.instagram.com/opolloluxuries", // Update with your actual social links
"https://twitter.com/opolloluxuries"
]
},
{
"@type": "WebSite",
"@id": "https://www.opolloluxuries.com/#website",
"url": "https://www.opolloluxuries.com",
"name": "Opollo Luxury Properties",
"publisher": {
"@id": "https://www.opolloluxuries.com/#organization"
}
}
]
};

// Inside your RootLayout component, render:
// <JsonLd schema={globalOrganizationSchema} /> 3. Homepage Schema (app/page.tsx)
This is where you target your highly competitive target queries ("Lagos", "property investment"). It maps directly to your explicit target market.

TypeScript
// app/page.tsx
import JsonLd from "@/components/seo/JsonLd";
import { siteMetadata } from "@/metadata/site";

export default function HomePage() {
const homepageSchema = {
"@context": "https://schema.org",
"@type": "RealEstateAgent",
"@id": "https://www.opolloluxuries.com/#agent",
"name": "Opollo Luxury Properties Ltd",
"image": "https://www.opolloluxuries.com/og-image.jpg",
"url": "https://www.opolloluxuries.com",
"telephone": siteMetadata.contact.whatsapp,
"priceRange": "$$$$",
"description": "Premium real estate development, sales, and consultancy serving local buyers and the Nigerian Diaspora with investment solutions in Lagos.",
"address": {
"@type": "PostalAddress",
"addressLocality": "Lagos",
"addressRegion": "Lagos State",
"addressCountry": "NG"
},
"geo": {
"@type": "GeoCoordinates",
"latitude": 6.5244,
"longitude": 3.3792
},
"areaServed": [
{
"@type": "AdministrativeArea",
"name": "Lagos"
},
{
"@type": "Country",
"name": "Nigeria"
}
]
};

return (
<>
<JsonLd schema={homepageSchema} />
{/_ Existing Homepage component content _/}
</>
);
} 4. Properties Main Directory Schema (app/properties/page.tsx)
This lets Google crawlers know that this specific route holds an aggregated collection of premium items, optimizing how index grids are categorized.

TypeScript
// app/properties/page.tsx
import JsonLd from "@/components/seo/JsonLd";

export default function PropertiesPage() {
const collectionSchema = {
"@context": "https://schema.org",
"@type": "CollectionPage",
"@id": "https://www.opolloluxuries.com/properties/#collection",
"url": "https://www.opolloluxuries.com/properties",
"name": "Premium Luxury Real Estate Listings in Lagos | Opollo",
"description": "Browse premium land for sale, commercial properties, and residential duplexes available across prime locations in Lagos, Nigeria."
};

return (
<>
<JsonLd schema={collectionSchema} />
{/_ Existing Properties archive UI _/}
</>
);
} 5. Contact Page Schema (app/contact/page.tsx)
Injecting contact definitions explicitly surfaces your telephone numbers and channels directly to operational panels in localized search algorithms.

TypeScript
// app/contact/page.tsx
import JsonLd from "@/components/seo/JsonLd";
import { siteMetadata } from "@/metadata/site";

export default function ContactPage() {
const contactSchema = {
"@context": "https://schema.org",
"@type": "ContactPage",
"@id": "https://www.opolloluxuries.com/contact/#contact",
"url": "https://www.opolloluxuries.com/contact",
"name": "Contact Opollo Luxury Properties",
"mainEntity": {
"@type": "LocalBusiness",
"name": "Opollo Luxury Properties Ltd",
"telephone": siteMetadata.contact.whatsapp,
"email": "info@opolloluxuries.com" // Update if different
}
};

return (
<>
<JsonLd schema={contactSchema} />
{/_ Existing Contact UI content _/}
</>
);
}

**Objective:** Implement modular, type-safe JSON-LD Structured Data (Schema Markup) across our existing Next.js 16 application to optimize search indexing for real estate queries.

**Context:**

- Current static pages: app/layout.tsx (Global), app/page.tsx (Home), app/properties/page.tsx (Archive), app/contact/page.tsx (Contact).
- Global configurations are imported via @/metadata/site.

**Execution Plan Instructions:**

1. Create a core generic wrapper component at components/seo/JsonLd.tsx that safely sets JSON stringified contents using the dangerouslySetInnerHTML pattern.
2. Inject the Organization and WebSite graph array directly inside the root app/layout.tsx wrapper hierarchy.
3. Configure app/page.tsx with a localized 'RealEstateAgent' target identity specifically declaring spatial values for Lagos and Nigeria.
4. Set up app/properties/page.tsx utilizing a structured 'CollectionPage' mapping layer.
5. Setup app/contact/page.tsx integrating explicit 'ContactPage' schemas targeting our active communications context data.
6. Ensure no structural syntax errors disrupt standard metadata bindings or streaming functions across all altered layouts.
