"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { useDiasporaLocation } from "@/hooks/useDiasporaLocation";
import { useProperties } from "@/hooks/useProperties";
import { type PropertyFilters } from "@/types";

import { PropertyCard } from "./PropertyCard";

export function PropertyGrid() {
  const searchParams = useSearchParams();
  const { currency } = useDiasporaLocation();
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
      <div className="py-10 text-center text-text-secondary">
        Loading properties...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-10 text-center text-red-600">
        Unable to load properties.
      </div>
    );
  }

  if (!data.properties.length) {
    return (
      <div className="py-10 text-center text-text-secondary">
        No properties found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.properties.map((property, index) => (
        <PropertyCard
          key={property.id}
          property={property}
          priority={index < 6}
        />
      ))}
    </div>
  );
}
