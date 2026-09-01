"use client";

import { FormEvent, useMemo } from "react";
import { toast } from "sonner";

import { useGuestSession } from "@/hooks/useGuestSession";
import { useSubmitInquiry } from "@/hooks/useInquiries";
import { InquirySource } from "@/types/enums";

type InquiryFormProps = {
  propertyId?: string;
};

export function InquiryForm({ propertyId }: InquiryFormProps) {
  const { session, saveSession } = useGuestSession();
  const submitInquiryMutation = useSubmitInquiry();

  const defaults = useMemo(
    () => ({
      name: session?.name ?? "",
      phone: session?.phone ?? "",
      email: session?.email ?? ""
    }),
    [session]
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const guestName = String(formData.get("guestName") ?? "");
    const guestPhone = String(formData.get("guestPhone") ?? "");
    const guestEmail = String(formData.get("guestEmail") ?? "");
    const message = String(formData.get("message") ?? "");

    saveSession({ name: guestName, phone: guestPhone, email: guestEmail || undefined });

    submitInquiryMutation.mutate(
      {
        guestName,
        guestPhone,
        guestEmail: guestEmail || undefined,
        propertyId,
        source: propertyId ? InquirySource.PROPERTY_PAGE : InquirySource.CONTACT_FORM,
        message: message || undefined
      },
      {
        onSuccess: (data) => {
          toast.success("Inquiry submitted! Redirecting to WhatsApp...");
          if (data?.whatsappUrl) {
            window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
          }
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to submit inquiry.");
        }
      }
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-border bg-bg-secondary p-4">
      <h2 className="text-lg font-semibold text-text-primary">Make an Inquiry</h2>
      <input
        name="guestName"
        defaultValue={defaults.name}
        placeholder="Full name"
        required
        className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
      />
      <input
        name="guestPhone"
        defaultValue={defaults.phone}
        placeholder="Phone number"
        required
        className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
      />
      <input
        type="email"
        name="guestEmail"
        defaultValue={defaults.email}
        placeholder="Email address (optional)"
        className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
      />
      <textarea
        name="message"
        rows={4}
        placeholder="Tell us what you need"
        className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
      />
      <button
        type="submit"
        id="main-enquiry-button"
        disabled={submitInquiryMutation.isPending}
        className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-light disabled:opacity-70 cursor-pointer">
        {submitInquiryMutation.isPending ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
