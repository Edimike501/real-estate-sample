"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce.hooks";
import { type Property } from "@/types";
import { formatEnum } from "@/lib/utils";

export function PropertyTable() {
  const [searchInput, setSearchInput] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const debouncedSearch = useDebounce(searchInput, 400);

  async function deleteProperty(property: Property) {
    const confirmed = window.confirm(`Delete "${property.title}"?`);
    if (!confirmed) return;

    const response = await fetch(`/api/properties/${property.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProperties((current) => current.filter((item) => item.id !== property.id));
    }
  }

  useEffect(() => {
    const query = new URLSearchParams();
    if (debouncedSearch) query.set("search", debouncedSearch);

    fetch(`/api/properties?${query.toString()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { properties: Property[] } | null) => {
        if (data) setProperties(data.properties);
      });
  }, [debouncedSearch]);

  return (
    <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search properties by title, city, or status..."
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
        />
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-border/80 bg-bg-primary">
        <table className="min-w-[800px] w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-text-muted bg-bg-secondary/40 border-b border-border/60">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Preview</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Title</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Type</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">City</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {properties.length > 0 ? (
              properties.map((property) => (
                <tr key={property.id} className="hover:bg-bg-secondary/15 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Image
                      src={property.media?.[0]?.thumbnailUrl ?? property.media?.[0]?.url ?? "/images/property-placeholder.png"}
                      alt={property.media?.[0]?.altText ?? property.title}
                      width={80}
                      height={56}
                      className="h-12 w-16 rounded-md border border-border object-cover bg-bg-secondary"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-text-primary font-semibold max-w-xs truncate" title={property.title}>
                    {property.title}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary font-medium whitespace-nowrap">
                    {formatEnum(property.listingType)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      property.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50" :
                      property.status === "SOLD" ? "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50" :
                      property.status === "LET" ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50" :
                      property.status === "UNDER_OFFER" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50" :
                      "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50"
                    }`}>
                      {formatEnum(property.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    {property.city}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/properties/${property.id}`}
                        title="View property"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/dashboard/properties/${property.id}/edit`}
                        title="Edit property"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        type="button"
                        title="Delete property"
                        onClick={() => void deleteProperty(property)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-500 bg-bg-primary"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                  No properties found matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
