import Link from "next/link";

import { ListingTypeBadge } from "@/components/property/ListingTypeBadge";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getDisplayPrice } from "@/lib/utils";
import { siteMetadata } from "@/metadata/site";
import { type Property } from "@/types";
import { MediaType } from "@/types/enums";
import { Bath, Bed, Ruler } from "lucide-react";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({
  property,
  priority = false
}: PropertyCardProps) {
  const firstImageMedia = property.media?.find(
    (item) => item.mediaType === MediaType.IMAGE
  );
  const firstImage =
    firstImageMedia?.thumbnailUrl ||
    firstImageMedia?.url ||
    property.image ||
    "";
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-bg-secondary transition hover:shadow-lg">
      <div className="relative h-60 bg-bg-tertiary">
        <CloudinaryImage
          src={firstImage}
          alt={property.title}
          width={800}
          height={600}
          className="h-full w-full object-cover"
          priority={priority}
        />
      </div>

      <div className="space-y-3 p-4">
        <ListingTypeBadge
          listingType={property.listingType}
          status={property.status}
        />
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {property.title}
          </h3>
          <p className="text-sm text-text-muted">
            {property.city}, {property.state}
          </p>
        </div>
        <p className="text-accent text-xl font-bold">
          {property.diasporaPrice || getDisplayPrice(property)}
        </p>
        <p className="line-clamp-2 text-sm text-text-secondary">
          {property.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-4 py-4 border-y border-border">
          {property.bedrooms && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {(property.sizeSqm || property.size) && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Ruler className="w-4 h-4" />
              <span>{property.size || `${property.sizeSqm} sqm`}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex w-full items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-light transition">
            View Property
          </Link>
          <WhatsAppButton
            phoneNumber={siteMetadata.contact.whatsapp}
            message={`Hi, I'm interested in ${property.title}.`}
            label="Enquire Now"
            className="w-full"
          />
        </div>
      </div>
    </article>
  );
}
