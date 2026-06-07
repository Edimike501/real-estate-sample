"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce.hooks";
import { type Inquiry } from "@/types";
import { formatEnum } from "@/lib/utils";

export function InquiryTable() {
  const [searchInput, setSearchInput] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const debouncedSearch = useDebounce(searchInput, 400);

  async function deleteInquiry(inquiry: Inquiry) {
    const confirmed = window.confirm(`Delete inquiry from "${inquiry.guestName}"?`);
    if (!confirmed) return;

    const response = await fetch(`/api/inquiries/${inquiry.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setInquiries((current) => current.filter((item) => item.id !== inquiry.id));
    }
  }

  useEffect(() => {
    fetch("/api/inquiries")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { inquiries: Inquiry[] } | null) => {
        if (!data) return;
        const items = data.inquiries.filter((inquiry) => {
          if (!debouncedSearch) return true;
          return (
            inquiry.guestName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            inquiry.guestPhone.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        });
        setInquiries(items);
      });
  }, [debouncedSearch]);

  return (
    <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search inquiries by guest name or phone..."
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
        />
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-border/80 bg-bg-primary">
        <table className="min-w-[800px] w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-text-muted bg-bg-secondary/40 border-b border-border/60">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Name</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Phone</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Source</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-bg-secondary/15 transition-colors">
                  <td className="px-4 py-3.5 text-text-primary font-semibold whitespace-nowrap">{inquiry.guestName}</td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">{inquiry.guestPhone}</td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">{formatEnum(inquiry.source)}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      inquiry.status === "NEW" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50" :
                      inquiry.status === "CONTACTED" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50" :
                      inquiry.status === "FOLLOW_UP" ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50" :
                      inquiry.status === "CLOSED" ? "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50" :
                      "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50"
                    }`}>
                      {formatEnum(inquiry.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/inquiries/${inquiry.id}`}
                        title="View inquiry"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/dashboard/inquiries/${inquiry.id}/edit`}
                        title="Edit inquiry"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        type="button"
                        title="Delete inquiry"
                        onClick={() => void deleteInquiry(inquiry)}
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
                <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
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
