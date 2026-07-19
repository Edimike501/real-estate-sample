import { type Property } from "@/types";
import { ListingType, PriceFrequency } from "@/types/enums";

import {
  formatBoolean,
  formatDate,
  formatFurnished,
  formatNegotiationStatus,
  formatNGN,
  formatRentalPrice
} from "@/lib/formatters";

type PropertyDetailListingFieldsProps = {
  property: Property;
};

type ListingFieldRenderer = (property: Property) => React.ReactNode;

// Helper component for rendering a single spec row
function SpecRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-xs font-medium uppercase tracking-wider text-text-muted sm:w-1/2">
        {label}
      </span>
      <span className="text-sm font-medium text-text-primary sm:w-1/2 sm:text-right">
        {value}
      </span>
    </div>
  );
}

// ── THE MAP PATTERN ──────────────────────────────────────────────────────────
// Define a map keyed on ListingType. Each entry is a React component or
// render function that receives the property and returns the relevant fields.
const LISTING_TYPE_FIELDS: Record<ListingType, ListingFieldRenderer> = {
  [ListingType.SALE]: (property) => (
    <div className="space-y-3">
      <SpecRow label="Sale Price" value={formatNGN(property.salePrice)} />
      <SpecRow
        label="Negotiation"
        value={formatNegotiationStatus(property.negotiationStatus)}
      />
      <SpecRow label="Title Type" value={property.titleType} />
      <SpecRow label="Year Built" value={property.yearBuilt?.toString()} />
    </div>
  ),

  [ListingType.RENTAL]: (property) => (
    <div className="space-y-3">
      <SpecRow
        label="Rental Price"
        value={formatRentalPrice(
          property.rentalPrice,
          property.priceFrequency as PriceFrequency
        )}
      />
      <SpecRow
        label="Available From"
        value={formatDate(property.availableFrom)}
      />
      <SpecRow label="Lease Term" value={property.leaseTerm} />
      <SpecRow
        label="Service Charge"
        value={formatNGN(property.serviceCharge)}
      />
      <SpecRow label="Caution Fee" value={formatNGN(property.cautionFee)} />
      <SpecRow label="Furnished" value={formatFurnished(property.furnished)} />
      <SpecRow
        label="Pets Allowed"
        value={formatBoolean(property.petsAllowed)}
      />
    </div>
  ),

  [ListingType.LAND]: (property) => (
    <div className="space-y-3">
      <SpecRow label="Sale Price" value={formatNGN(property.salePrice)} />
      <SpecRow
        label="Land Size"
        value={
          property.landSizeSqm
            ? `${property.landSizeSqm.toLocaleString()} sqm`
            : null
        }
      />
      <SpecRow label="Title Type" value={property.titleType} />
      <SpecRow label="Zoning Type" value={property.zoningType} />
      <SpecRow
        label="Negotiation"
        value={formatNegotiationStatus(property.negotiationStatus)}
      />
    </div>
  ),

  [ListingType.DEVELOPMENT]: (property) => (
    <div className="space-y-3">
      <SpecRow label="Starting Price" value={formatNGN(property.salePrice)} />
      <SpecRow
        label="Negotiation"
        value={formatNegotiationStatus(property.negotiationStatus)}
      />
      <SpecRow
        label="Est. Completion"
        value={formatDate(property.estimatedCompletion)}
      />
      <SpecRow label="Title Type" value={property.titleType} />
      <SpecRow label="Year Built" value={property.yearBuilt?.toString()} />
    </div>
  )
};

export function PropertyDetailListingFields({
  property
}: PropertyDetailListingFieldsProps) {
  const renderer = LISTING_TYPE_FIELDS[property.listingType as ListingType];
  if (!renderer) return null;

  const listingTypeLabel = property.listingType as ListingType;
  const sectionTitle = {
    [ListingType.SALE]: "Sale Details",
    [ListingType.RENTAL]: "Rental Details",
    [ListingType.LAND]: "Land Details",
    [ListingType.DEVELOPMENT]: "Development Details"
  }[listingTypeLabel];

  return (
    <section className="rounded-lg border border-border bg-bg-secondary p-6">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">
        {sectionTitle}
      </h2>
      {renderer(property)}
    </section>
  );
}
