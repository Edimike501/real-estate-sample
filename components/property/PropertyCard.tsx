"use client";

import Link from "next/link";
import { Play } from "lucide-react";

import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteMetadata } from "@/metadata/site";
import { type Property } from "@/types";
import { MediaType, PropertyStatus } from "@/types/enums";
import { Bath, Bed, Ruler } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import PriceDisplay from "./PriceDisplay";
import BookmarkButton from "./BookmarkButton";
import { listingTypeConfig, statusConfig, getNormalizedStatus } from "./ListingTypeBadge";
import { timeAgo } from "@/lib/timeAgo";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({
  property,
  priority = false
}: PropertyCardProps) {
  const { currency, rates } = useCurrency();
  const firstImageMedia = property.media?.find(
    (item) => item.mediaType === MediaType.IMAGE
  );
  const firstImage =
    firstImageMedia?.thumbnailUrl ||
    firstImageMedia?.url ||
    property.image ||
    "";

  const normalizedStatus = getNormalizedStatus(property.status);
  const isSoldOrLet = normalizedStatus === PropertyStatus.SOLD || normalizedStatus === PropertyStatus.LET;

  const listingConfig = listingTypeConfig[property.listingType];
  const statConfig = normalizedStatus ? statusConfig[normalizedStatus] : null;

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-bg-secondary transition hover:shadow-lg relative flex flex-col h-full">
      {/* Card Image Section */}
      <div className="relative h-60 bg-bg-tertiary overflow-hidden shrink-0">
        <div className={`h-full w-full transition duration-300 ${isSoldOrLet ? "opacity-70 grayscale-[30%]" : ""}`}>
          <CloudinaryImage
            src={firstImage}
            alt={property.title}
            width={800}
            height={600}
            className="h-full w-full object-cover"
            priority={priority}
          />
        </div>

        {/* Badges Overlays */}
        <div className="absolute top-3 left-3 z-10">
          {listingConfig && (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${listingConfig.className} shadow-sm`}>
              {listingConfig.label}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
          {statConfig && (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statConfig.className} shadow-sm`}>
              {statConfig.label}
            </span>
          )}
          {/* Bookmark heart overlay */}
          <BookmarkButton propertyId={property.id} variant="icon" />
        </div>

        {/* Virtual Tour Badge overlay (bottom-left) */}
        {property.virtualTourUrl && (
          <div className="absolute bottom-3 left-3 z-10">
            <a
              href={property.virtualTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white px-2 py-1 rounded-full text-[10px] font-semibold transition hover:bg-black/80"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Virtual Tour</span>
            </a>
          </div>
        )}
      </div>

      {/* Card Content Section */}
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-text-primary line-clamp-1">
            {property.title}
          </h3>
          <p className="text-xs text-text-muted">
            {property.city}, {property.state}
          </p>
        </div>

        {/* Price display with currency switcher support */}
        <div className="mb-2">
          <PriceDisplay
            ngnAmount={property.listingType === "RENTAL" ? property.rentalPrice : property.salePrice}
            currency={currency}
            rates={rates}
            frequency={property.priceFrequency}
            negotiationStatus={property.negotiationStatus}
            size="md"
          />
          <p className="text-[10px] text-text-muted mt-0.5">
            {timeAgo(property.createdAt)}
          </p>
        </div>

        <p className="line-clamp-2 text-sm text-text-secondary mb-4 flex-1">
          {property.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-4 py-3 border-y border-border mb-4">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Bed className="w-3.5 h-3.5" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Bath className="w-3.5 h-3.5" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {(property.sizeSqm || property.size) && (
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Ruler className="w-3.5 h-3.5" />
              <span>{property.size || `${property.sizeSqm} sqm`}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex w-full items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-light transition cursor-pointer">
            View Property
          </Link>
          <WhatsAppButton
            phoneNumber={siteMetadata.contact.whatsapp}
            message={`Hi, I'm interested in ${property.title}.`}
            label="Enquire Now"
            className="w-full text-xs"
          />
        </div>
      </div>
    </article>
  );
}
