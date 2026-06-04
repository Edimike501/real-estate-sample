import { ListingType, PropertyStatus } from "@/types/enums";

type ListingTypeBadgeProps = {
  listingType: ListingType | `${ListingType}`;
  status?: PropertyStatus | `${PropertyStatus}` | "Available" | "Sold" | "Under Offer";
};

const listingTypeConfig: Record<ListingType, { label: string; className: string }> = {
  [ListingType.SALE]: { label: "For Sale", className: "bg-yellow-100 text-yellow-800" },
  [ListingType.RENTAL]: { label: "For Rent", className: "bg-blue-100 text-blue-800" },
  [ListingType.LAND]: { label: "Land", className: "bg-green-100 text-green-800" },
  [ListingType.DEVELOPMENT]: { label: "Off Plan", className: "bg-orange-100 text-orange-800" },
};

const statusConfig: Record<PropertyStatus, { label: string; className: string }> = {
  [PropertyStatus.AVAILABLE]: { label: "Available", className: "bg-green-100 text-green-800" },
  [PropertyStatus.SOLD]: { label: "Sold", className: "bg-red-100 text-red-800" },
  [PropertyStatus.LET]: { label: "Let", className: "bg-red-100 text-red-800" },
  [PropertyStatus.UNDER_OFFER]: { label: "Under Offer", className: "bg-amber-100 text-amber-800" },
  [PropertyStatus.COMING_SOON]: { label: "Coming Soon", className: "bg-slate-100 text-slate-700" },
};

export function ListingTypeBadge({ listingType, status }: ListingTypeBadgeProps) {
  const listing = listingTypeConfig[listingType];
  const normalizedStatus =
    status === "Available"
      ? PropertyStatus.AVAILABLE
      : status === "Sold"
        ? PropertyStatus.SOLD
        : status === "Under Offer"
          ? PropertyStatus.UNDER_OFFER
          : status;
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
