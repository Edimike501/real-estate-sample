import { Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import ClientPropertyMap from "@/components/property/ClientPropertyMap";
import { BackButton } from "@/components/ui/BackButton";
import { ListingTypeBadge } from "@/components/property/ListingTypeBadge";
import { PropertyDetailFeatures } from "@/components/property/PropertyDetailFeatures";
import { PropertyDetailListingFields } from "@/components/property/PropertyDetailListingFields";
import { PropertyDetailSpecs } from "@/components/property/PropertyDetailSpecs";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { prisma } from "@/lib/prisma";

export default async function PropertyDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, deletedAt: null },
    include: {
      media: { orderBy: { order: "asc" } },
      inquiries: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!property) notFound();

  const inquiryCount = property.inquiries?.length ?? 0;

  return (
    <div className="space-y-6">
      <BackButton
        href="/admin/dashboard/properties"
        label="Back to Properties"
        variant="minimal"
      />

      {/* Header: Property title + status badge + listing type badge */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <ListingTypeBadge
              listingType={property.listingType}
              status={property.status}
            />
            <span className="text-xs text-text-muted font-medium">
              Listed {new Date(property.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            {property.title}
          </h1>
          <p className="text-text-secondary">
            {[property.city, property.lga, property.state, property.country].filter(Boolean).join(", ")}
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/dashboard/properties/${property.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition">
            <Edit size={16} />
            Edit Property
          </Link>
          <Link
            href={`/properties/${property.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-primary hover:bg-bg-tertiary transition">
            <ExternalLink size={16} />
            View on Site
          </Link>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT COLUMN - Property details */}
        <div className="space-y-6">
          {/* At-a-Glance Features */}
          <PropertyDetailFeatures property={property} />

          {/* Property Description */}
          <section className="rounded-lg border border-border bg-bg-secondary p-6">
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              Description
            </h2>
            <p className="whitespace-pre-line text-text-secondary">
              {property.description}
            </p>
          </section>

          {/* Property Specifications */}
          <PropertyDetailSpecs property={property} />

          {/* Listing-Type-Specific Fields */}
          <PropertyDetailListingFields property={property} />

          {/* Map */}
          <ClientPropertyMap
            latitude={property.latitude ?? null}
            longitude={property.longitude ?? null}
            address={property.address ?? null}
            landmark={property.landmark ?? null}
            propertyTitle={property.title}
          />
        </div>

        {/* RIGHT COLUMN - Inquiry count, media grid */}
        <div className="space-y-6">
          {/* Inquiry Card */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">
              Inquiries
            </h3>
            <div className="mb-4">
              <p className="text-3xl font-bold text-text-primary">
                {inquiryCount}
              </p>
              <p className="text-sm text-text-muted">Total inquiries</p>
            </div>
            <Link
              href={`/admin/dashboard/inquiries?propertyId=${property.id}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-bg-primary px-4 py-2 text-sm font-semibold text-text-primary hover:bg-bg-tertiary transition">
              View All Inquiries
            </Link>
          </div>

          {/* Media Grid */}
          {property.media && property.media.length > 0 && (
            <div className="rounded-lg border border-border bg-bg-secondary p-5">
              <h3 className="mb-4 text-lg font-semibold text-text-primary">
                Media
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {property.media.slice(0, 6).map((media) => (
                  <div
                    key={media.id}
                    className="aspect-square overflow-hidden rounded-md border border-border">
                    <CloudinaryImage
                      src={media.url}
                      alt={media.altText || property.title}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {property.media.length > 6 && (
                <p className="mt-2 text-xs text-text-muted">
                  +{property.media.length - 6} more images
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
