import { PropertyFilter } from "@/components/property/PropertyFilter";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Suspense } from "react";

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-bg-primary section-padding">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold text-text-primary">All Properties</h1>
          <p className="text-text-secondary">Search, filter, and browse available listings.</p>
        </div>
        <Suspense fallback={<div className="text-center text-text-secondary">Loading filters...</div>}>
          <PropertyFilter />
        </Suspense>
        <Suspense fallback={<div className="text-center text-text-secondary">Loading properties...</div>}>
          <PropertyGrid />
        </Suspense>
      </section>
    </main>
  );
}
