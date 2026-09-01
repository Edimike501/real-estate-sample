"use client";

import { Edit, Eye, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AppSelect } from "@/components/ui/app-select";
import { useDebounce } from "@/hooks/use-debounce.hooks";
import {
  useAdminInquiries,
  useDeleteInquiry,
  useUpdateInquiryStatus
} from "@/hooks/useInquiries";
import { useAdminProperties } from "@/hooks/useProperties";
import { formatEnum } from "@/lib/utils";
import { type Inquiry, type Property } from "@/types";
import { InquiryStatus } from "@/types/enums";

export function InquiryTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPropertyId = searchParams.get("propertyId") || "";

  const [searchInput, setSearchInput] = useState("");
  const selectedPropertyId = urlPropertyId;
  const debouncedSearch = useDebounce(searchInput, 400);

  // Fetch properties for property filter options using React Query
  const { data: propertiesData } = useAdminProperties({});
  const properties = propertiesData?.properties || [];

  // Fetch inquiries using React Query
  const { data, isLoading } = useAdminInquiries({
    search: debouncedSearch,
    propertyId: selectedPropertyId
  });
  const inquiries = data?.inquiries || [];

  const updateStatusMutation = useUpdateInquiryStatus();
  const deleteInquiryMutation = useDeleteInquiry();

  function performDeleteInquiry(inquiry: Inquiry) {
    deleteInquiryMutation.mutate(inquiry.id, {
      onSuccess: () => {
        toast.success("Inquiry deleted successfully");
      },
      onError: (err) => {
        toast.error(
          err instanceof Error ? err.message : "Failed to delete inquiry"
        );
      }
    });
  }

  function deleteInquiry(inquiry: Inquiry) {
    toast.warning("Confirm Deletion", {
      description: `Delete inquiry from "${inquiry.guestName}"?`,
      action: {
        label: "Delete",
        onClick: () => performDeleteInquiry(inquiry)
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  }

  function handleStatusChange(inquiryId: string, newStatus: string) {
    updateStatusMutation.mutate(
      { id: inquiryId, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Inquiry status updated");
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Failed to update status"
          );
        }
      }
    );
  }

  const handlePropertyChange = (propertyId: string) => {
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
          className="flex-1 min-w-50 rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
        />
        <div className="w-64 flex items-center gap-1.5">
          <AppSelect
            value={selectedPropertyId}
            placeholder="Filter by Property"
            options={properties.map((p: Property) => ({
              value: p.id,
              label: p.title
            }))}
            onValueChange={handlePropertyChange}
          />
          {selectedPropertyId && (
            <button
              onClick={() => handlePropertyChange("")}
              className="p-2 border border-border rounded-md text-text-muted hover:text-text-primary hover:border-accent bg-bg-primary cursor-pointer"
              title="Clear property filter">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-border/80 bg-bg-primary">
        <table className="min-w-200 w-full text-sm border-collapse">
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
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text-muted">
                  Loading inquiries...
                </td>
              </tr>
            ) : inquiries.length > 0 ? (
              inquiries.map((inquiry: Inquiry) => (
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
                        className="text-accent hover:underline font-medium">
                        {inquiry.property.title}
                      </a>
                    ) : (
                      <span className="text-text-muted italic">
                        General Inquiry
                      </span>
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
                        disabled={updateStatusMutation.isPending}
                        options={Object.values(InquiryStatus).map((value) => ({
                          value,
                          label: formatEnum(value)
                        }))}
                        onValueChange={(value) =>
                          handleStatusChange(inquiry.id, value)
                        }
                        className="w-36"
                      />
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
                        onClick={() => deleteInquiry(inquiry)}
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
