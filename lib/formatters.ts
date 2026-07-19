import {
  ListingType,
  NegotiationStatus,
  PriceFrequency,
  PropertyStatus
} from "@/types/enums";

export function formatNGN(amount: number | null | undefined): string | null {
  if (amount == null) return null;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(
  date: Date | string | null | undefined
): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

export function formatRentalPrice(
  price: number | null | undefined,
  frequency: PriceFrequency | null | undefined
): string | null {
  if (price == null) return null;
  const base = formatNGN(price);
  const freqMap: Record<PriceFrequency, string> = {
    ONE_OFF: "",
    PER_MONTH: " / month",
    PER_YEAR: " / year"
  };
  const suffix = frequency ? freqMap[frequency] : "";
  return `${base}${suffix}`;
}

export function formatListingType(type: ListingType): string {
  const map: Record<ListingType, string> = {
    SALE: "For Sale",
    RENTAL: "For Rent",
    LAND: "Land",
    DEVELOPMENT: "Off Plan / Development"
  };
  return map[type];
}

export function formatPropertyStatus(status: PropertyStatus): string {
  const map: Record<PropertyStatus, string> = {
    AVAILABLE: "Available",
    SOLD: "Sold",
    LET: "Let",
    UNDER_OFFER: "Under Offer",
    COMING_SOON: "Coming Soon"
  };
  return map[status];
}

export function formatNegotiationStatus(
  status: NegotiationStatus | string
): string {
  const map: Record<string, string> = {
    FIXED: "Fixed Price",
    NEGOTIABLE: "Price Negotiable",
    CONTACT_FOR_PRICE: "Contact for Price"
  };
  return map[status] || status;
}

export function formatFurnished(
  value: boolean | null | undefined
): string | null {
  if (value === null || value === undefined) return null;
  return value ? "Furnished" : "Unfurnished";
}

export function formatBoolean(
  value: boolean | null | undefined
): string | null {
  if (value === null || value === undefined) return null;
  return value ? "Yes" : "No";
}

export function formatSize(sqm: number | null | undefined): string | null {
  if (sqm == null) return null;
  return `${sqm.toLocaleString()} sqm`;
}
