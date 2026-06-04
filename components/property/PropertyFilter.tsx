"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/use-debounce.hooks";
import { AppSelect } from "@/components/ui/app-select";
import { ListingType, PropertyStatus } from "@/types/enums";

export function PropertyFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Keep a ref to searchParams so the debounce effect can read current
  // values without listing searchParams as a dependency (which would
  // cause an infinite loop: effect → router.replace → new searchParams → effect).
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [cityInput, setCityInput] = useState(searchParams.get("city") ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);
  const debouncedCity = useDebounce(cityInput, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");

    if (debouncedCity) params.set("city", debouncedCity);
    else params.delete("city");

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, debouncedCity, pathname, router]);

  function onSelectChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:grid-cols-5">
      <input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search properties"
        className="rounded-md border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
      />
      <input
        value={cityInput}
        onChange={(event) => setCityInput(event.target.value)}
        placeholder="City / Area"
        className="rounded-md border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
      />

      <AppSelect
        value={searchParams.get("listingType") ?? ""}
        placeholder="Listing Type"
        options={Object.values(ListingType).map((value) => ({ value, label: value }))}
        onValueChange={(value) => onSelectChange("listingType", value)}
      />

      <AppSelect
        value={searchParams.get("status") ?? ""}
        placeholder="Status"
        options={Object.values(PropertyStatus).map((value) => ({ value, label: value }))}
        onValueChange={(value) => onSelectChange("status", value)}
      />

      <AppSelect
        value={searchParams.get("featured") ?? ""}
        placeholder="All"
        options={[
          { value: "true", label: "Featured" },
          { value: "false", label: "Non Featured" },
        ]}
        onValueChange={(value) => onSelectChange("featured", value)}
      />
    </div>
  );
}
