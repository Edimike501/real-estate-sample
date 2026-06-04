"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce.hooks";
import { type Property } from "@/types";

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
    <div className="space-y-3 rounded-lg border border-border bg-bg-secondary p-4">
      <input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search properties"
        className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted">
              <th className="py-2 pr-3">Preview</th>
              <th className="py-2">Title</th>
              <th className="py-2">Type</th>
              <th className="py-2">Status</th>
              <th className="py-2">City</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-border">
                <td className="py-2 pr-3">
                  <Image
                    src={property.media?.[0]?.thumbnailUrl ?? property.media?.[0]?.url ?? "/images/property-placeholder.png"}
                    alt={property.media?.[0]?.altText ?? property.title}
                    width={80}
                    height={56}
                    className="h-14 w-20 rounded-md border border-border object-cover"
                  />
                </td>
                <td className="py-2 text-text-primary">{property.title}</td>
                <td className="py-2 text-text-secondary">{property.listingType}</td>
                <td className="py-2 text-text-secondary">{property.status}</td>
                <td className="py-2 text-text-secondary">{property.city}</td>
                <td className="py-2">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/dashboard/properties/${property.id}`}
                      title="View property"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/dashboard/properties/${property.id}/edit`}
                      title="Edit property"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      type="button"
                      title="Delete property"
                      onClick={() => void deleteProperty(property)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
