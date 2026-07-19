import { BedDouble, Bath, Toilet, Maximize2, Map } from "lucide-react";

import { type Property } from "@/types";
import { ListingType } from "@/types/enums";

type PropertyDetailFeaturesProps = {
  property: Property;
};

const FEATURE_ITEMS = [
  { key: "bedrooms", icon: BedDouble, label: (v: number) => `${v} Bed${v !== 1 ? "s" : ""}` },
  { key: "bathrooms", icon: Bath, label: (v: number) => `${v} Bath${v !== 1 ? "s" : ""}` },
  { key: "toilets", icon: Toilet, label: (v: number) => `${v} Toilet${v !== 1 ? "s" : ""}` },
  { key: "sizeSqm", icon: Maximize2, label: (v: number) => `${v.toLocaleString()} sqm` },
  { key: "landSizeSqm", icon: Map, label: (v: number) => `${v.toLocaleString()} sqm land` },
] as const;

export function PropertyDetailFeatures({ property }: PropertyDetailFeaturesProps) {
  const listingType = property.listingType as ListingType;

  // Filter features based on listing type and availability
  const visibleFeatures = FEATURE_ITEMS.filter((item) => {
    const value = property[item.key as keyof Property] as number | null | undefined;
    
    // Skip if value is null/undefined
    if (value == null) return false;

    // Listing type specific filtering
    if (listingType === ListingType.LAND) {
      // For LAND: show landSizeSqm, hide bedrooms/bathrooms/toilets/sizeSqm
      if (item.key === "landSizeSqm") return true;
      return false;
    }

    if (listingType === ListingType.DEVELOPMENT) {
      // For DEVELOPMENT: show sizeSqm + bedrooms + bathrooms
      if (item.key === "landSizeSqm") return false;
      return true;
    }

    // For SALE and RENTAL: show all applicable fields
    return true;
  });

  if (visibleFeatures.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {visibleFeatures.map((item) => {
        const Icon = item.icon;
        const value = property[item.key as keyof Property] as number;
        return (
          <div
            key={item.key}
            className="flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2"
          >
            <Icon size={18} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">{item.label(value)}</span>
          </div>
        );
      })}
    </div>
  );
}
