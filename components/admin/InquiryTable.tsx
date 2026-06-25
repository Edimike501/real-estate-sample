"use client";

import { Edit, Eye, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppSelect } from "@/components/ui/app-select";
import { useDebounce } from "@/hooks/use-debounce.hooks";
import { formatEnum } from "@/lib/utils";
import { type Inquiry } from "@/types";
import { InquiryStatus } from "@/types/enums";

export function InquiryTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPropertyId = searchParams.get("propertyId") || "";

  const [searchInput, setSearchInput] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [properties, setProperties] = useState<{ id: string; title: string }[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(urlPropertyId);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});

  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync state with URL propertyId
  useEffect(() => {
    setSelectedPropertyId(urlPropertyId);
  }, [urlPropertyId]);

  // Fetch properties for the filter dropdown
  useEffect(() => {
    fetch("/api/properties?select=id,title")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { properties: { id: string; title: string }[] } | null) => {
        if (data?.properties) {
          setProperties(data.properties);
        }
      });
  }, []);

  // Fetch inquiries based on search and property filter
  useEffect(() => {
    const url = selectedPropertyId
      ? `/api/inquiries?propertyId=${selectedPropertyId}`
      : "/api/inquiries";

    fetch(url)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { inquiries: Inquiry[] } | null) => {
        if (!data) return;
        const items = data.inquiries.filter((inquiry) => {
          if (!debouncedSearch) return true;
          return (
            inquiry.guestName
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase()) ||
            inquiry.guestPhone
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase())
          );
        });
        setInquiries(items);
      });
  }, [debouncedSearch, selectedPropertyId]);

  async function performDeleteInquiry(inquiry: Inquiry) {
    try {
      const response = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setInquiries((current) =>
          current.filter((item) => item.id !== inquiry.id)
        );
        toast.success("Inquiry deleted successfully");
      } else {
        toast.error("Failed to delete inquiry");
      }
    } catch {
      toast.error("Failed to delete inquiry");
    }
  }

  function deleteInquiry(inquiry: Inquiry) {
    toast.warning("Confirm Deletion", {
      description: `Delete inquiry from "${inquiry.guestName}"?`,
      action: {
        label: "Delete",
        onClick: () => void performDeleteInquiry(inquiry),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }

  async function updateStatus(inquiry: Inquiry, newStatus: string) {
    const originalStatus = inquiry.status;

    // Optimistically update UI
    setInquiries((current) =>
      current.map((item) =>
        item.id === inquiry.id
          ? { ...item, status: newStatus as InquiryStatus }
          : item
      )
    );
    setUpdatingIds((prev) => ({ ...prev, [inquiry.id]: true }));

    try {
      const response = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inquiry.id, status: newStatus })
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      toast.success("Inquiry status updated");
    } catch (err) {
      console.error(err);
      // Revert status on error
      setInquiries((current) =>
        current.map((item) =>
          item.id === inquiry.id
            ? { ...item, status: originalStatus }
            : item
        )
      );
      toast.error("Failed to update status. Reverted.");
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [inquiry.id]: false }));
    }
  }

  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const params = new URLSearchParams(searchParams.toString());
    if (propertyId) {
      params.set("propertyId", propertyId);
    } else {
      params.delete("propertyId");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm relative">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search inquiries by guest name or phone..."
          className="flex-1 min-w-[200px] rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
        />
        <div className="w-64 flex items-center gap-1.5">
          <AppSelect
            value={selectedPropertyId}
            placeholder="Filter by Property"
            options={properties.map((p) => ({ value: p.id, label: p.title }))}
            onValueChange={handlePropertyChange}
          />
          {selectedPropertyId && (
            <button
              onClick={() => handlePropertyChange("")}
              className="p-2 border border-border rounded-md text-text-muted hover:text-text-primary hover:border-accent bg-bg-primary cursor-pointer"
              title="Clear property filter"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-border/80 bg-bg-primary">
        <table className="min-w-[800px] w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-text-muted bg-bg-secondary/40 border-b border-border/60">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Name
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Phone
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Property
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Source
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted text-right whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="hover:bg-bg-secondary/15 transition-colors">
                  <td className="px-4 py-3.5 text-text-primary font-semibold whitespace-nowrap">
                    {inquiry.guestName}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    {inquiry.guestPhone}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    {inquiry.property ? (
                      <a
                        href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/properties/${inquiry.property.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline font-medium"
                      >
                        {inquiry.property.title}
                      </a>
                    ) : (
                      <span className="text-text-muted italic">General Inquiry</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    {formatEnum(inquiry.source)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <AppSelect
                        name={`status-${inquiry.id}`}
                        value={String(inquiry.status)}
                        placeholder="Status"
                        disabled={updatingIds[inquiry.id]}
                        options={Object.values(InquiryStatus).map((value) => ({
                          value,
                          label: formatEnum(value)
                        }))}
                        onValueChange={(value) =>
                          void updateStatus(inquiry, value)
                        }
                        className="w-36"
                      />
                      {updatingIds[inquiry.id] && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent flex-shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/inquiries/${inquiry.id}`}
                        title="View inquiry"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary">
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/dashboard/inquiries/${inquiry.id}/edit`}
                        title="Edit inquiry"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary">
                        <Edit size={15} />
                      </Link>
                      <button
                        type="button"
                        title="Delete inquiry"
                        onClick={() => void deleteInquiry(inquiry)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-500 bg-bg-primary cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text-muted">
                  No inquiries found matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
