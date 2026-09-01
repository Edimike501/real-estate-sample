"use client";

import { use } from "react";

import { InquiryDetail } from "@/components/admin/InquiryDetail";
import { BackButton } from "@/components/ui/BackButton";
import { useAdminInquiry } from "@/hooks/useInquiries";

export default function InquiryDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: inquiry, isLoading, isError, error } = useAdminInquiry(id);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-bg-secondary rounded" />
        <div className="h-64 bg-bg-secondary rounded-lg border border-border" />
      </div>
    );
  }

  if (isError || !inquiry) {
    return (
      <div className="space-y-4">
        <BackButton
          href="/admin/dashboard/inquiries"
          label="Back to Inquiries"
          variant="minimal"
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <h3 className="font-semibold text-lg">Inquiry Not Found</h3>
          <p className="mt-1 text-sm">
            {error instanceof Error ? error.message : "The requested inquiry could not be loaded."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BackButton
        href="/admin/dashboard/inquiries"
        label="Back to Inquiries"
        variant="minimal"
      />
      <h1 className="text-2xl font-bold text-text-primary">Inquiry Detail</h1>
      <InquiryDetail inquiry={inquiry} />
    </div>
  );
}
