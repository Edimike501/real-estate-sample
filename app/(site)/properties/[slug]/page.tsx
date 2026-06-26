import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PropertyDetailBackNav } from "@/components/property/PropertyDetailBackNav";
import { InquiryForm } from "@/components/property/InquiryForm";
import PropertyClientActions from "@/components/property/PropertyClientActions";
import { PropertyDetailHero } from "@/components/property/PropertyDetailHero";
import { timeAgo } from "@/lib/timeAgo";

import ClientPropertyMap from "@/components/property/ClientPropertyMap";
import { PropertyDetailFeatures } from "@/components/property/PropertyDetailFeatures";
import { PropertyDetailListingFields } from "@/components/property/PropertyDetailListingFields";
import { PropertyDetailSpecs } from "@/components/property/PropertyDetailSpecs";
import { formatNegotiationStatus } from "@/lib/formatters";
import {
  buildPropertyDescription,
  getPropertyBySlug,
  optimizeCloudinaryUrl
} from "@/lib/properties";
import { ExternalLink } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found — Opollo Luxury Properties",
      description: "The property you're looking for could not be found."
    };
  }

  // Get first image media item or fallback to default OG image
  const firstImage = property.media?.find((m) => m.mediaType === "IMAGE");
  const ogImage = firstImage?.url ?? property.media?.[0]?.url ?? "/og-image.jpg";
  const optimizedImage = optimizeCloudinaryUrl(ogImage);

  // Build location string
  const location = [property.city, property.lga, property.state].filter(Boolean).join(", ");

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
          alt: property.title
        }
      ],
      type: "website",
      locale: "en_NG"
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: ogDescription,
      images: [optimizedImage]
    }
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  // Virtual tour helpers
  function isYouTubeUrl(url: string): boolean {
    return url.includes("youtube.com") || url.includes("youtu.be");
  }

  function isVimeoUrl(url: string): boolean {
    return url.includes("vimeo.com");
  }

  function getEmbedUrl(url: string): string | null {
    if (isYouTubeUrl(url)) {
      const videoId = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
      )?.[1];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (isVimeoUrl(url)) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
    return null;
  }

  const virtualTourEmbed = property.virtualTourUrl
    ? getEmbedUrl(property.virtualTourUrl)
    : null;

  const locationStr = [property.city, property.lga, property.state, property.country]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="section-padding bg-bg-primary min-h-screen">
      <div className="mx-auto max-w-7xl">
        <PropertyDetailBackNav />

        {/* Image Gallery - Full Width */}
        <PropertyDetailHero property={property} />

        {/* Client Share / Bookmarks Action Bar & Mobile Sticky bottom bar */}
        <PropertyClientActions
          propertyId={property.id}
          propertyTitle={property.title}
          propertySlug={property.slug}
          propertyLocation={locationStr}
        />

        {/* Two-column layout below on desktop, single column on mobile */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT COLUMN - Main Content */}
          <div className="space-y-6">
            {/* At-a-Glance Features Row */}
            <PropertyDetailFeatures property={property} />

            {/* Property Description Card */}
            <section className="rounded-lg border border-border bg-bg-secondary p-6">
              <h2 className="mb-3 text-xl font-semibold text-text-primary">
                Property Description
              </h2>
              <p className="whitespace-pre-line text-text-secondary">
                {property.description}
              </p>
            </section>

            {/* Property Specifications */}
            <PropertyDetailSpecs property={property} />

            {/* Listing-Type-Specific Fields */}
            <PropertyDetailListingFields property={property} />

            {/* Virtual Tour Section */}
            {property.virtualTourUrl && (
              <section className="rounded-lg border border-border bg-bg-secondary p-6">
                <h2 className="mb-4 text-lg font-semibold text-text-primary">
                  Virtual Tour
                </h2>
                {virtualTourEmbed ? (
                  <div className="overflow-hidden rounded-lg">
                    <iframe
                      src={virtualTourEmbed}
                      className="h-55 w-full md:h-100"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={property.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
                    <ExternalLink size={16} />
                    View Virtual Tour
                  </a>
                )}
              </section>
            )}

            {/* Map + Get Directions */}
            <ClientPropertyMap
              latitude={property.latitude ?? null}
              longitude={property.longitude ?? null}
              address={property.address ?? null}
              landmark={property.landmark ?? null}
              propertyTitle={property.title}
            />
          </div>

          {/* RIGHT COLUMN - Sticky Sidebar (hidden on mobile) */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* Enquiry Card */}
              <div className="rounded-lg border border-border bg-bg-secondary p-5">
                <h2 className="mb-4 text-lg font-semibold text-text-primary">
                  Enquire About This Property
                </h2>

                {/* Negotiation Badge */}
                <div className="mb-4 inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {formatNegotiationStatus(property.negotiationStatus)}
                </div>

                <InquiryForm propertyId={property.id} />

                {/* Listed X days ago */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-text-muted">
                    {timeAgo(property.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
