"use client";

import { FileText, Mail, MessageSquare, Phone, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

import { AppSelect } from "@/components/ui/app-select";
import { useUpdateInquiryStatus } from "@/hooks/useInquiries";
import { type Inquiry } from "@/types";
import { InquiryStatus } from "@/types/enums";

type InquiryEditFormProps = {
  inquiry: Inquiry;
};

export function InquiryEditForm({ inquiry }: InquiryEditFormProps) {
  const router = useRouter();
  const updateStatusMutation = useUpdateInquiryStatus();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const statusVal = String(formData.get("status") ?? inquiry.status);
    const adminNotesVal = String(formData.get("adminNotes") ?? "") || undefined;

    updateStatusMutation.mutate(
      {
        id: inquiry.id,
        status: statusVal,
        adminNotes: adminNotesVal
      },
      {
        onSuccess: () => {
          toast.success("Inquiry saved successfully.");
          router.push(`/admin/dashboard/inquiries/${inquiry.id}`);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to save inquiry.");
        }
      }
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border/50 pb-2">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-1">
            <label
              htmlFor="guestName"
              className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <User size={14} />
              Guest Name
            </label>
            <input
              id="guestName"
              name="guestName"
              defaultValue={inquiry.guestName}
              placeholder="e.g. Osinachi Michael"
              disabled
              className="w-full rounded-md border border-border bg-bg-secondary/50 px-3 py-2.5 text-sm text-text-muted cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label
              htmlFor="guestPhone"
              className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Phone size={14} />
              Phone Number
            </label>
            <input
              id="guestPhone"
              name="guestPhone"
              defaultValue={inquiry.guestPhone}
              placeholder="e.g. 09128093115"
              disabled
              className="w-full rounded-md border border-border bg-bg-secondary/50 px-3 py-2.5 text-sm text-text-muted cursor-not-allowed"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label
            htmlFor="guestEmail"
            className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Mail size={14} />
            Email Address
          </label>
          <input
            id="guestEmail"
            name="guestEmail"
            type="email"
            defaultValue={inquiry.guestEmail ?? ""}
            placeholder="e.g. devmyke24@gmail.com"
            disabled
            className="w-full rounded-md border border-border bg-bg-secondary/50 px-3 py-2.5 text-sm text-text-muted cursor-not-allowed"
          />
        </div>
      </div>

      {/* Inquiry Details Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border/50 pb-2">
          Inquiry Details
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Source */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <MessageSquare size={14} />
              Inquiry Source
            </label>
            <input
              name="source"
              defaultValue={String(inquiry.source)}
              disabled
              className="w-full rounded-md border border-border bg-bg-secondary/50 px-3 py-2.5 text-sm text-text-muted cursor-not-allowed"
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <FileText size={14} />
              Inquiry Status
            </label>
            <AppSelect
              name="status"
              defaultValue={String(inquiry.status)}
              placeholder="Select status"
              options={Object.values(InquiryStatus).map((value) => ({
                value,
                label: value
              }))}
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label
            htmlFor="message"
            className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <MessageSquare size={14} />
            Message
          </label>
          <textarea
            id="message"
            name="message"
            defaultValue={inquiry.message ?? ""}
            placeholder="Guest's inquiry message..."
            disabled
            className="min-h-24 w-full rounded-md border border-border bg-bg-secondary/50 px-3 py-2.5 text-sm text-text-muted cursor-not-allowed leading-relaxed resize-none"
          />
        </div>
      </div>

      {/* Admin Notes Section */}
      <div className="space-y-4 rounded-lg border border-border/50 bg-bg-primary p-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Admin Notes
        </h3>
        <div className="space-y-1">
          <label
            htmlFor="adminNotes"
            className="text-xs font-semibold text-text-muted">
            Internal notes (not visible to guest)
          </label>
          <textarea
            id="adminNotes"
            name="adminNotes"
            defaultValue={inquiry.adminNotes ?? ""}
            placeholder="Add internal notes about this inquiry..."
            className="min-h-20 w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 transition leading-relaxed resize-y"
          />
        </div>
      </div>

      {/* Submit Section */}
      <div className="pt-3 border-t border-border flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={updateStatusMutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition cursor-pointer">
          <Save size={16} />
          {updateStatusMutation.isPending ? "Saving..." : "Save Inquiry"}
        </button>
      </div>
    </form>
  );
}
