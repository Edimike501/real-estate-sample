"use client";

import { Copy, Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useDebounce } from "@/hooks/use-debounce.hooks";
import { formatEnum } from "@/lib/utils";
import { type Property } from "@/types";

export function PropertyTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab =
    searchParams.get("tab") === "archived" ? "archived" : "active";

  const [searchInput, setSearchInput] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  async function performDeleteProperty(property: Property) {
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setProperties((current) =>
          current.filter((item) => item.id !== property.id)
        );
        toast.success("Property archived successfully.");
      } else {
        toast.error("Failed to archive property.");
      }
    } catch {
      toast.error("Failed to archive property.");
    }
  }

  function deleteProperty(property: Property) {
    toast.warning("Confirm Archiving", {
      description: `Archive "${property.title}"?`,
      action: {
        label: "Archive",
        onClick: () => void performDeleteProperty(property)
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  }

  async function performRestoreProperty(property: Property) {
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true })
      });

      if (response.ok) {
        setProperties((current) =>
          current.filter((item) => item.id !== property.id)
        );
        toast.success("Property restored successfully.");
      } else {
        toast.error("Failed to restore property.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while restoring property.");
    }
  }

  function restoreProperty(property: Property) {
    toast.warning("Confirm Restoration", {
      description: `Restore "${property.title}"?`,
      action: {
        label: "Restore",
        onClick: () => void performRestoreProperty(property)
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  }

  async function duplicateProperty(propertyId: string) {
    setDuplicatingId(propertyId);
    try {
      const response = await fetch(`/api/properties/${propertyId}/duplicate`, {
        method: "POST"
      });
      const data = await response.json();
      if (response.ok && data.success && data.property) {
        toast.success(
          "Property duplicated. Review and update details before publishing."
        );
        router.push(`/admin/dashboard/properties/${data.property.id}/edit`);
      } else {
        toast.error(data.error || "Failed to duplicate property.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while duplicating property.");
    } finally {
      setDuplicatingId(null);
    }
  }

  useEffect(() => {
    const query = new URLSearchParams();
    if (debouncedSearch) query.set("search", debouncedSearch);
    query.set("tab", currentTab);

    fetch(`/api/properties?${query.toString()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { properties: Property[] } | null) => {
        if (data) setProperties(data.properties);
      });
  }, [debouncedSearch, currentTab]);

  const handleTabChange = (tab: "active" | "archived") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm relative">
      {/* Tabs Layout */}
      <div className="flex border-b border-border">
        <button
          onClick={() => handleTabChange("active")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 cursor-pointer transition-colors mb-[-2px] ${
            currentTab === "active"
              ? "border-accent text-accent"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}>
          Active Listings
        </button>
        <button
          onClick={() => handleTabChange("archived")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 cursor-pointer transition-colors mb-[-2px] ${
            currentTab === "archived"
              ? "border-accent text-accent"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}>
          Archived Listings
        </button>
      </div>

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
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Preview
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Title
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Type
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Inquiries
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                City
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted text-right whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {properties.length > 0 ? (
              properties.map((property) => (
                <tr
                  key={property.id}
                  className={`hover:bg-bg-secondary/15 transition-colors ${
                    currentTab === "archived" ? "opacity-60" : ""
                  }`}>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {(() => {
                      const firstImage = property.media?.find(
                        (m) => m.mediaType === "IMAGE"
                      );
                      const src =
                        firstImage?.thumbnailUrl ??
                        firstImage?.url ??
                        "/images/property-placeholder.png";
                      return (
                        <Image
                          src={src}
                          alt={firstImage?.altText ?? property.title}
                          width={80}
                          height={56}
                          className="h-12 w-16 rounded-md border border-border object-cover bg-bg-secondary"
                        />
                      );
                    })()}
                  </td>
                  <td
                    className="px-4 py-3.5 text-text-primary font-semibold max-w-xs truncate"
                    title={property.title}>
                    {property.title}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary font-medium whitespace-nowrap">
                    {formatEnum(property.listingType)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        property.status === "AVAILABLE"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                          : property.status === "SOLD"
                            ? "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50"
                            : property.status === "LET"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50"
                              : property.status === "UNDER_OFFER"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50"
                      }`}>
                      {formatEnum(property.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {(() => {
                      const count = property._count?.inquiries ?? 0;
                      let badgeStyle =
                        "bg-neutral-100 text-neutral-600 dark:bg-neutral-800/45 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50";
                      if (count > 0 && count <= 5) {
                        badgeStyle =
                          "bg-blue-50 text-blue-700 dark:bg-blue-950/45 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50";
                      } else if (count > 5) {
                        badgeStyle =
                          "bg-accent text-white border border-accent";
                      }
                      return (
                        <Link
                          href={`/admin/dashboard/inquiries?propertyId=${property.id}`}
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold transition hover:opacity-85 ${badgeStyle}`}>
                          {count}
                        </Link>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    {property.city}
                    {property.lga && ` (${property.lga})`}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      {currentTab === "archived" ? (
                        <button
                          type="button"
                          title="Restore property"
                          onClick={() => void restoreProperty(property)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-accent text-accent text-xs font-semibold hover:bg-accent/5 transition cursor-pointer">
                          Restore
                        </button>
                      ) : (
                        <>
                          <Link
                            href={`/admin/dashboard/properties/${property.id}`}
                            title="View property"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary">
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/admin/dashboard/properties/${property.id}/edit`}
                            title="Edit property"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary">
                            <Edit size={15} />
                          </Link>
                          <button
                            type="button"
                            title="Duplicate property"
                            disabled={duplicatingId === property.id}
                            onClick={() => void duplicateProperty(property.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary cursor-pointer disabled:opacity-50">
                            <Copy size={15} />
                          </button>
                          <button
                            type="button"
                            title="Archive property"
                            onClick={() => void deleteProperty(property)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-500 bg-bg-primary cursor-pointer">
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-text-muted">
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
