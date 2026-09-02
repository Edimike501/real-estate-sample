"use client";

import { SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { useDiasporaLocation } from "@/hooks/useDiasporaLocation";
import { useProperties } from "@/hooks/useProperties";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { type Property, type PropertyFilters } from "@/types";
import { InquirySource } from "@/types/enums";
import { useGuestSession } from "@/hooks/useGuestSession";
import { useSubmitInquiry } from "@/hooks/useInquiries";

import { PropertyCard } from "./PropertyCard";

export function PropertyGrid() {
  const searchParams = useSearchParams();
  const { currency } = useDiasporaLocation();
  const { session } = useGuestSession();
  const submitInquiryMutation = useSubmitInquiry();
  const filters = useMemo<PropertyFilters>(
    () => ({
      search: searchParams.get("search") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      listingType:
        (searchParams.get("listingType") as PropertyFilters["listingType"]) ??
        undefined,
      status:
        (searchParams.get("status") as PropertyFilters["status"]) ?? undefined,
      featured:
        searchParams.get("featured") === null
          ? undefined
          : searchParams.get("featured") === "true",
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 12)
    }),
    [searchParams]
  );

  const { data, isLoading, isError } = useProperties(
    filters,
    currency || "USD"
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="overflow-hidden rounded-lg border border-border bg-bg-secondary animate-pulse h-112.5"
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-16 text-center text-red-600 font-semibold">
        Unable to load properties. Please try again.
      </div>
    );
  }

  if (!data.properties.length) {
    const waMessage =
      "Hi, I searched for properties on your website but couldn't find what I need. Can you help me?";
    const waLink = buildWhatsAppLink({
      guestName: "",
      guestPhone: "",
      source: InquirySource.CONTACT_FORM,
      customMessage: waMessage
    });

    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-border rounded-xl bg-bg-secondary/40 max-w-xl mx-auto space-y-4">
        <div className="p-3 bg-bg-tertiary rounded-full text-text-secondary">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-text-primary font-display uppercase tracking-wide">
          No properties found
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed max-w-md">
          Try adjusting your filters or search terms — or reach out to us
          directly and we&apos;ll help you find exactly what you&apos;re looking
          for.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            submitInquiryMutation.mutate({
              guestName: session?.name || "Guest",
              guestPhone: session?.phone || "0000000000",
              guestEmail: session?.email || undefined,
              source: InquirySource.CONTACT_FORM,
              message: waMessage
            });
          }}
          className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-light transition shadow-sm cursor-pointer">
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.properties.map((property: Property, index: number) => (
        <PropertyCard
          key={property.id}
          property={property}
          priority={index < 6}
        />
      ))}
    </div>
  );
}
