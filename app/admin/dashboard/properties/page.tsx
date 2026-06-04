import Link from "next/link";

import { PropertyTable } from "@/components/admin/PropertyTable";

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Properties</h1>
        <Link href="/admin/dashboard/properties/new" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">
          New Property
        </Link>
      </div>
      <PropertyTable />
    </div>
  );
}
