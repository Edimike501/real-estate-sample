import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { InquiryForm } from "@/components/property/InquiryForm";
import { PropertyDetailHero } from "@/components/property/PropertyDetailHero";
import { PropertyMap } from "@/components/property/PropertyMap";
import {
  getPropertyBySlug,
  buildPropertyDescription,
  optimizeCloudinaryUrl,
} from "@/lib/properties";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found — Opollo Luxury Properties",
      description: "The property you're looking for could not be found.",
    };
  }

  // Get first media item or fallback to default OG image
  const ogImage = property.media?.[0]?.url ?? "/og-image.jpg";
  const optimizedImage = optimizeCloudinaryUrl(ogImage);
  
  // Build location string
  const location = [property.city, property.state].filter(Boolean).join(", ");
  
  // Build OG description with price, specs, and location
  const ogDescription = buildPropertyDescription(property);

  return {
    title: `${property.title} — ${location} | Opollo Luxury Properties`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: ogDescription,
      url: `https://www.opolloluxuries.com/properties/${property.slug}`,
      siteName: "Opollo Luxury Properties",
      images: [
        {
          url: optimizedImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: "website",
      locale: "en_NG",
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: ogDescription,
      images: [optimizedImage],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  return (
    <main className="section-padding bg-bg-primary min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <PropertyDetailHero property={property} />
          <section className="rounded-lg border border-border bg-bg-secondary p-6">
            <h2 className="mb-3 text-xl font-semibold text-text-primary">Property Description</h2>
            <p className="whitespace-pre-line text-text-secondary">{property.description}</p>
          </section>
          <PropertyMap
            latitude={property.latitude ?? null}
            longitude={property.longitude ?? null}
            address={property.address ?? null}
            landmark={property.landmark ?? null}
            propertyTitle={property.title}
          />
        </div>
        <div className="space-y-6">
          <InquiryForm propertyId={property.id} />
        </div>
      </div>
    </main>
  );
}
