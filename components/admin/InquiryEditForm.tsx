"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { AppSelect } from "@/components/ui/app-select";
import { type Inquiry } from "@/types";
import { InquirySource, InquiryStatus } from "@/types/enums";

type InquiryEditFormProps = {
  inquiry: Inquiry;
};

export function InquiryEditForm({ inquiry }: InquiryEditFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      guestName: String(formData.get("guestName") ?? ""),
      guestPhone: String(formData.get("guestPhone") ?? ""),
      guestEmail: String(formData.get("guestEmail") ?? "") || undefined,
      source: String(formData.get("source") ?? ""),
      status: String(formData.get("status") ?? ""),
      message: String(formData.get("message") ?? "") || undefined,
      adminNotes: String(formData.get("adminNotes") ?? "") || undefined,
    };

    const response = await fetch(`/api/inquiries/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("Inquiry saved.");
      router.push(`/admin/dashboard/inquiries/${inquiry.id}`);
      router.refresh();
      return;
    }

    setStatus("Failed to save inquiry.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-border bg-bg-secondary p-4">
      <input name="guestName" defaultValue={inquiry.guestName} placeholder="Name" required className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm" />
      <input name="guestPhone" defaultValue={inquiry.guestPhone} placeholder="Phone" required className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm" />
      <input name="guestEmail" type="email" defaultValue={inquiry.guestEmail ?? ""} placeholder="Email" className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm" />
      <AppSelect
        name="source"
        defaultValue={String(inquiry.source)}
        placeholder="Inquiry Source"
        options={Object.values(InquirySource).map((value) => ({ value, label: value }))}
      />
      <AppSelect
        name="status"
        defaultValue={String(inquiry.status)}
        placeholder="Inquiry Status"
        options={Object.values(InquiryStatus).map((value) => ({ value, label: value }))}
      />
      <textarea name="message" defaultValue={inquiry.message ?? ""} placeholder="Message" className="min-h-24 w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm" />
      <textarea name="adminNotes" defaultValue={inquiry.adminNotes ?? ""} placeholder="Admin notes" className="min-h-24 w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm" />
      <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">
        Save Inquiry
      </button>
      {status ? <p className="text-sm text-text-secondary">{status}</p> : null}
    </form>
  );
}
