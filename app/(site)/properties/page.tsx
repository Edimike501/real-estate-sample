// 📁 app/properties/page.tsx
import { PropertiesBackButton } from "@/components/property/PropertiesBackButton";
import { PropertyFilter } from "@/components/property/PropertyFilter";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { Suspense } from "react";

// 1. Pristine Normalized Metadata Architecture
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.auraluxuryproperties.com"
  ),
  title: "All Properties - Aura Luxury Properties",
  description:
    "Search, filter, and browse available luxury real estate listings in Lagos, Nigeria.",
  alternates: {
    // Explicitly tells Google that the non-slash URL is the single authoritative path
    canonical: "/properties"
  }
};

export default function PropertiesPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.auraluxuryproperties.com";

  // 2. Align Schema Links with the Canonical Metadata
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    // Cleaned up hash mapping string templates:
    "@id": `${baseUrl.replace(/\/$/, "")}/properties#collection`,
    url: `${baseUrl.replace(/\/$/, "")}/properties`,
    name: "All Properties - Aura Luxury Properties",
    description:
      "Search, filter, and browse available luxury real estate listings in Lagos, Nigeria."
  };

  return (
    <>
      <JsonLd schema={collectionSchema} />
      <main className="min-h-screen bg-bg-primary section-padding">
        <section className="mx-auto max-w-7xl space-y-6">
          <Suspense fallback={null}>
            <PropertiesBackButton />
          </Suspense>
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-text-primary">
              All Properties
            </h1>
            <p className="text-text-secondary">
              Search, filter, and browse available listings.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="text-center text-text-secondary">
                Loading filters...
              </div>
            }>
            <PropertyFilter />
          </Suspense>
          <Suspense
            fallback={
              <div className="text-center text-text-secondary">
                Loading properties...
              </div>
            }>
            <PropertyGrid />
          </Suspense>
        </section>
      </main>
    </>
  );
}
