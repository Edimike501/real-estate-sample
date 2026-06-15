"use client";

import { useSearchParams } from "next/navigation";

import { BackButton } from "@/components/ui/BackButton";

export function PropertiesBackButton() {
  const searchParams = useSearchParams();

  const hasActiveFilters = Array.from(searchParams.entries()).some(
    ([key, value]) => key !== "page" && Boolean(value)
  );

  if (!hasActiveFilters) return null;

  return (
    <div className="w-full sm:w-auto">
      <BackButton href="/" label="Home" variant="default" className="w-full sm:w-auto" />
    </div>
  );
}
