import { type Property } from "@/types";
import { ListingType, PropertyStatus, NegotiationStatus } from "@/types/enums";

import {
  formatListingType,
  formatPropertyStatus,
  formatNegotiationStatus,
  formatSize,
} from "@/lib/formatters";

type PropertyDetailSpecsProps = {
  property: Property;
};

const SHARED_SPECS = [
  { label: "Property Type", value: (p: Property) => formatListingType(p.listingType as ListingType) },
  { label: "Status", value: (p: Property) => formatPropertyStatus(p.status as PropertyStatus) },
  { label: "City", value: (p: Property) => p.city },
  { label: "State", value: (p: Property) => p.state },
  { label: "Country", value: (p: Property) => p.country },
  { label: "Size", value: (p: Property) => formatSize(p.sizeSqm) },
  { label: "Bedrooms", value: (p: Property) => p.bedrooms?.toString() },
  { label: "Bathrooms", value: (p: Property) => p.bathrooms?.toString() },
  { label: "Toilets", value: (p: Property) => p.toilets?.toString() },
  { label: "Title Type", value: (p: Property) => p.titleType },
  { label: "Address", value: (p: Property) => p.address || p.landmark },
  { label: "Year Built", value: (p: Property) => p.yearBuilt?.toString() },
  { label: "Negotiation", value: (p: Property) => formatNegotiationStatus(p.negotiationStatus as NegotiationStatus) },
] as const;

export function PropertyDetailSpecs({ property }: PropertyDetailSpecsProps) {
  // Filter specs to only show those with values
  const visibleSpecs = SHARED_SPECS.filter((spec) => {
    const value = spec.value(property);
    return value != null && value !== "";
  });

  if (visibleSpecs.length === 0) return null;

  return (
    <section className="rounded-lg border border-border bg-bg-secondary p-6">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">Property Specifications</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visibleSpecs.map((spec) => {
          const value = spec.value(property);
          if (!value) return null;
          return (
            <div key={spec.label} className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {spec.label}
              </span>
              <span className="text-sm font-medium text-text-primary">{value}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
