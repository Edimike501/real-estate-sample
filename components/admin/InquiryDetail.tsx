import Link from "next/link";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { type Inquiry } from "@/types";

type InquiryDetailInquiry = Omit<Inquiry, "property"> & {
  property?: {
    id: string;
    title: string;
    slug: string;
    city: string;
    state: string;
  } | null;
};

type InquiryDetailProps = {
  inquiry: InquiryDetailInquiry;
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function InquiryDetail({ inquiry }: InquiryDetailProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xl font-semibold text-text-primary">{inquiry.guestName}</p>
          <p className="text-text-secondary">{inquiry.guestPhone}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/dashboard/inquiries/${inquiry.id}/edit`}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Edit Inquiry
          </Link>
          <AdminDeleteButton
            endpoint={`/api/inquiries/${inquiry.id}`}
            label="Delete Inquiry"
            confirmMessage={`Delete inquiry from "${inquiry.guestName}"?`}
            redirectTo="/admin/dashboard/inquiries"
          />
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div><dt className="text-text-muted">Email</dt><dd className="text-text-primary">{inquiry.guestEmail ?? "Not provided"}</dd></div>
        <div><dt className="text-text-muted">Source</dt><dd className="text-text-primary">{inquiry.source}</dd></div>
        <div><dt className="text-text-muted">Status</dt><dd className="text-text-primary">{inquiry.status}</dd></div>
        <div><dt className="text-text-muted">Created</dt><dd className="text-text-primary">{formatDate(inquiry.createdAt)}</dd></div>
      </dl>

      {inquiry.property ? (
        <div className="rounded-md border border-border bg-bg-primary p-3">
          <p className="font-semibold text-text-primary">{inquiry.property.title}</p>
          <p className="text-text-secondary">{inquiry.property.city}, {inquiry.property.state}</p>
        </div>
      ) : null}

      {inquiry.message ? (
        <div>
          <p className="mb-1 text-text-muted">Message</p>
          <p className="whitespace-pre-line text-text-secondary">{inquiry.message}</p>
        </div>
      ) : null}

      <div>
        <p className="mb-1 text-text-muted">WhatsApp message</p>
        <p className="whitespace-pre-line text-text-secondary">{inquiry.whatsappMessage}</p>
      </div>

      {inquiry.adminNotes ? (
        <div>
          <p className="mb-1 text-text-muted">Admin notes</p>
          <p className="whitespace-pre-line text-text-secondary">{inquiry.adminNotes}</p>
        </div>
      ) : null}
    </div>
  );
}
