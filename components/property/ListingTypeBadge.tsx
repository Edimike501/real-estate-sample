import { ListingType, PropertyStatus } from "@/types/enums";

type ListingTypeBadgeProps = {
  listingType: ListingType | `${ListingType}`;
  status?: PropertyStatus | `${PropertyStatus}` | "Available" | "Sold" | "Under Offer";
};

export const listingTypeConfig: Record<ListingType, { label: string; className: string }> = {
  [ListingType.SALE]: { label: "For Sale", className: "bg-accent-muted text-accent" },
  [ListingType.RENTAL]: { label: "For Rent", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  [ListingType.LAND]: { label: "Land", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  [ListingType.DEVELOPMENT]: { label: "Off Plan", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
};

export const statusConfig: Record<PropertyStatus, { label: string; className: string }> = {
  [PropertyStatus.AVAILABLE]: { label: "AVAILABLE", className: "bg-status-available text-white" },
  [PropertyStatus.SOLD]: { label: "SOLD", className: "bg-status-sold text-white" },
  [PropertyStatus.LET]: { label: "LET", className: "bg-status-let text-white" },
  [PropertyStatus.UNDER_OFFER]: { label: "UNDER OFFER", className: "bg-status-offer text-text-primary font-medium" },
  [PropertyStatus.COMING_SOON]: { label: "COMING SOON", className: "bg-status-soon text-white" },
};

export function getNormalizedStatus(
  status?: PropertyStatus | `${PropertyStatus}` | "Available" | "Sold" | "Under Offer" | null
): PropertyStatus | null {
  if (!status) return null;
  if (status === "Available") return PropertyStatus.AVAILABLE;
  if (status === "Sold") return PropertyStatus.SOLD;
  if (status === "Under Offer") return PropertyStatus.UNDER_OFFER;
  return status as PropertyStatus;
}

export function ListingTypeBadge({ listingType, status }: ListingTypeBadgeProps) {
  const listing = listingTypeConfig[listingType as ListingType] || { label: listingType, className: "bg-gray-100 text-gray-800" };
  const normalizedStatus = getNormalizedStatus(status);
  const statusStyle = normalizedStatus ? statusConfig[normalizedStatus] : null;

  return (
    <div className="flex flex-wrap gap-2">
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${listing.className}`}>
        {listing.label}
      </span>
      {statusStyle ? (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.className}`}>
          {statusStyle.label}
        </span>
      ) : null}
    </div>
  );
}
