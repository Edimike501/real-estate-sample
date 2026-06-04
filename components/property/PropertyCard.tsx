import Link from "next/link";

import { ListingTypeBadge } from "@/components/property/ListingTypeBadge";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { getDisplayPrice } from "@/lib/utils";
import { type Property } from "@/types";
import { MediaType } from "@/types/enums";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const firstImageMedia = property.media?.find((item) => item.mediaType === MediaType.IMAGE);
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
          {getDisplayPrice(property)}
        </p>
        <p className="line-clamp-2 text-sm text-text-secondary">
          {property.description}
        </p>
        <Link
          href={`/properties/${property.slug}`}
          className="inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-light">
          View Property
        </Link>
      </div>
    </article>
  );
}
