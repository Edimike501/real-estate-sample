import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Property } from "@/types";
import { PriceFrequency } from "@/types/enums";

/**
 * Merge Tailwind CSS classes with clsx, removing duplicates
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function generateWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodedMessage}`;
}

/**
 * Format currency to Nigerian Naira
 */
export function formatNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Get display price including frequency for rentals
 */
export function getDisplayPrice(property: Property): string {
  if (property.salePrice) return formatNGN(property.salePrice);
  if (property.rentalPrice) {
    const price = formatNGN(property.rentalPrice);
    if (property.priceFrequency === PriceFrequency.PER_YEAR) return `${price} / Year`;
    if (property.priceFrequency === PriceFrequency.PER_MONTH) return `${price} / Month`;
    return price;
  }
  return "Contact for price";
}

/**
 * Truncate text to a specified length with ellipsis
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Format enum strings to human-readable strings (e.g. SUPER_ADMIN -> Super Admin, SALE -> Sale)
 */
export function formatEnum(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

