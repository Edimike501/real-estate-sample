"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce.hooks";
import { type Inquiry } from "@/types";

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
    <div className="space-y-3 rounded-lg border border-border bg-bg-secondary p-4">
      <input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search inquiries"
        className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted">
              <th className="py-2">Name</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Source</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-t border-border">
                <td className="py-2 text-text-primary">{inquiry.guestName}</td>
                <td className="py-2 text-text-secondary">{inquiry.guestPhone}</td>
                <td className="py-2 text-text-secondary">{inquiry.source}</td>
                <td className="py-2 text-text-secondary">{inquiry.status}</td>
                <td className="py-2">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/dashboard/inquiries/${inquiry.id}`}
                      title="View inquiry"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/dashboard/inquiries/${inquiry.id}/edit`}
                      title="Edit inquiry"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      type="button"
                      title="Delete inquiry"
                      onClick={() => void deleteInquiry(inquiry)}
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
