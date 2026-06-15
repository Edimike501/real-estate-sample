"use client";

import { useCallback, useRef } from "react";

import {
  PropertyForm,
  type PropertyFormNavigationGuard,
} from "@/components/admin/PropertyForm";
import { BackButton } from "@/components/ui/BackButton";
import { type Property } from "@/types";

const BACK_HREF = "/admin/dashboard/properties";

type PropertyFormPageContentProps = {
  title: string;
  property?: Property;
};

export function PropertyFormPageContent({
  title,
  property,
}: PropertyFormPageContentProps) {
  const guardRef = useRef<PropertyFormNavigationGuard | null>(null);

  const handleRegisterGuard = useCallback((guard: PropertyFormNavigationGuard) => {
    guardRef.current = guard;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BackButton
          href={BACK_HREF}
          label="Back to Properties"
          variant="minimal"
          onBeforeNavigate={async () => {
            const guard = guardRef.current;
            if (!guard?.isDirty()) return true;
            return guard.confirmLeave(BACK_HREF);
          }}
        />
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
      </div>
      <PropertyForm
        property={property}
        onRegisterNavigationGuard={handleRegisterGuard}
      />
    </div>
  );
}
