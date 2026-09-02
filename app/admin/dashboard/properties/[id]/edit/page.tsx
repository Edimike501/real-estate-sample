"use client";

import { use } from "react";

import { PropertyFormPageContent } from "@/components/admin/PropertyFormPageContent";
import { BackButton } from "@/components/ui/BackButton";
import { useAdminProperty } from "@/hooks/useProperties";

export default function EditPropertyPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: property, isLoading, isError, error } = useAdminProperty(id);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-bg-secondary rounded" />
        <div className="h-96 bg-bg-secondary rounded-lg border border-border" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="space-y-4">
        <BackButton
          href="/admin/dashboard/properties"
          label="Back to Properties"
          variant="minimal"
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <h3 className="font-semibold text-lg">Property Not Found</h3>
          <p className="mt-1 text-sm">
            {error instanceof Error ? error.message : "The requested property could not be loaded."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PropertyFormPageContent
      title={`Edit ${property.title}`}
      property={property}
    />
  );
}
