import Image from "next/image";
import Link from "next/link";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { type Property } from "@/types";

type PropertyDetailProps = {
  property: Property;
};

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function formatMoney(value: number | null | undefined) {
  if (!value) return "Not set";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const preview = property.media?.[0]?.thumbnailUrl ?? property.media?.[0]?.url ?? "/images/property-placeholder.png";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/dashboard/properties/${property.id}/edit`}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Edit Property
        </Link>
        <AdminDeleteButton
          endpoint={`/api/properties/${property.id}`}
          label="Delete Property"
          confirmMessage={`Delete "${property.title}"?`}
          redirectTo="/admin/dashboard/properties"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-bg-secondary">
        <Image src={preview} alt={property.title} width={1200} height={420} className="h-72 w-full object-cover" />
        <div className="space-y-4 p-4">
          <div>
            <p className="text-sm text-text-muted">{property.listingType} / {property.status}</p>
            <h2 className="text-xl font-semibold text-text-primary">{property.title}</h2>
            <p className="text-sm text-text-secondary">{property.city}, {property.state}</p>
          </div>
          <p className="whitespace-pre-line text-sm leading-6 text-text-secondary">{property.description}</p>
          <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="text-text-muted">Sale price</dt><dd className="text-text-primary">{formatMoney(property.salePrice)}</dd></div>
            <div><dt className="text-text-muted">Rental price</dt><dd className="text-text-primary">{formatMoney(property.rentalPrice)}</dd></div>
            <div><dt className="text-text-muted">Bedrooms</dt><dd className="text-text-primary">{property.bedrooms ?? "Not set"}</dd></div>
            <div><dt className="text-text-muted">Bathrooms</dt><dd className="text-text-primary">{property.bathrooms ?? "Not set"}</dd></div>
            <div><dt className="text-text-muted">Size</dt><dd className="text-text-primary">{property.sizeSqm ? `${property.sizeSqm} sqm` : "Not set"}</dd></div>
            <div><dt className="text-text-muted">Created</dt><dd className="text-text-primary">{formatDate(property.createdAt)}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
