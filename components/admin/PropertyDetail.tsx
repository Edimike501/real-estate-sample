import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  Compass,
  FileText,
  ExternalLink,
  Edit,
  DollarSign,
  ArrowLeft,
  Layers,
} from "lucide-react";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { PropertyMediaPreview } from "@/components/admin/PropertyMediaPreview";
import { PropertyMap } from "@/components/property/PropertyMap";
import { type Property } from "@/types";
import { formatEnum } from "@/lib/utils";

type PropertyDetailProps = {
  property: Property;
};

function formatMoney(value: number | null | undefined) {
  if (!value) return null;
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const statusBadgeStyles: Record<string, string> = {
    AVAILABLE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50",
    SOLD: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50",
    LET: "bg-purple-100 text-purple-800 dark:bg-purple-950/45 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50",
    UNDER_OFFER: "bg-amber-100 text-amber-800 dark:bg-amber-950/45 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50",
    COMING_SOON: "bg-blue-100 text-blue-800 dark:bg-blue-950/45 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50",
  };

  const statusClass = statusBadgeStyles[property.status] || statusBadgeStyles.AVAILABLE;

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-secondary border border-border p-4 rounded-lg shadow-sm">
        <Link
          href="/admin/dashboard/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Properties
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/dashboard/properties/${property.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition"
          >
            <Edit size={14} />
            Edit Property
          </Link>
          <AdminDeleteButton
            endpoint={`/api/properties/${property.id}`}
            label="Delete Property"
            confirmMessage={`Are you sure you want to delete "${property.title}"?`}
            redirectTo="/admin/dashboard/properties"
          />
        </div>
      </div>

      {/* 2. Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Image Showcase & Description */}
        <div className="lg:col-span-2 space-y-6">
          <PropertyMediaPreview
            title={property.title}
            description={property.description}
            city={property.city}
            state={property.state}
            country={property.country}
            media={property.media}
            status={property.status}
            statusClass={statusClass}
            listingType={property.listingType}
            isFeatured={property.isFeatured}
          />
        </div>

        {/* Right Side: Specifications & Pricing Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center gap-1.5">
              <DollarSign size={16} className="text-accent" />
              Pricing Details
            </h3>

            <div className="space-y-3">
              {property.salePrice && (
                <div>
                  <span className="text-xs text-text-muted block font-medium">Sale Price</span>
                  <span className="text-xl font-bold text-text-primary tracking-tight">
                    {formatMoney(property.salePrice)}
                  </span>
                </div>
              )}

              {property.rentalPrice && (
                <div>
                  <span className="text-xs text-text-muted block font-medium">Rental Price</span>
                  <span className="text-xl font-bold text-text-primary tracking-tight">
                    {formatMoney(property.rentalPrice)}
                    <span className="text-xs text-text-muted font-normal ml-1">
                      {property.priceFrequency ? `/${formatEnum(property.priceFrequency).split(" ")[1] || "Period"}` : ""}
                    </span>
                  </span>
                </div>
              )}

              {!property.salePrice && !property.rentalPrice && (
                <div className="py-2 text-center text-sm font-semibold text-text-secondary italic">
                  Contact for Price
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                <div>
                  <span className="text-text-muted block">Service Charge</span>
                  <span className="font-semibold text-text-primary">
                    {formatMoney(property.serviceCharge) ?? "Not set"}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block">Caution Fee</span>
                  <span className="font-semibold text-text-primary">
                    {formatMoney(property.cautionFee) ?? "Not set"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 flex justify-between items-center text-xs">
                <span className="text-text-muted">Negotiability:</span>
                <span className="font-semibold text-text-secondary bg-bg-primary border border-border px-2 py-0.5 rounded">
                  {formatEnum(property.negotiationStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Specifications Card */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center gap-1.5">
              <Layers size={16} className="text-accent" />
              Specifications
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-bg-primary text-text-muted border border-border">
                  <Bed size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">Bedrooms</span>
                  <span className="font-semibold text-text-primary">{property.bedrooms ?? "-"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-bg-primary text-text-muted border border-border">
                  <Bath size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">Bathrooms</span>
                  <span className="font-semibold text-text-primary">{property.bathrooms ?? "-"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-bg-primary text-text-muted border border-border">
                  <Maximize2 size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">Property Size</span>
                  <span className="font-semibold text-text-primary">
                    {property.sizeSqm ? `${property.sizeSqm} sqm` : "-"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-bg-primary text-text-muted border border-border">
                  <Compass size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">Land Size</span>
                  <span className="font-semibold text-text-primary">
                    {property.landSizeSqm ? `${property.landSizeSqm} sqm` : "-"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-bg-primary text-text-muted border border-border">
                  <FileText size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">Title Type</span>
                  <span className="font-semibold text-text-primary truncate max-w-[100px]" title={property.titleType || ""}>
                    {property.titleType ?? "-"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-bg-primary text-text-muted border border-border">
                  <Calendar size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">Listed Date</span>
                  <span className="font-semibold text-text-primary">
                    {new Intl.DateTimeFormat("en", { dateStyle: "short" }).format(new Date(property.createdAt))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location & External Card */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center gap-1.5">
              <MapPin size={16} className="text-accent" />
              Detailed Location
            </h3>

            <div className="space-y-3 text-xs">
              {property.address && (
                <div>
                  <span className="text-text-muted block font-medium mb-0.5">Address</span>
                  <p className="text-text-secondary leading-relaxed bg-bg-primary p-2.5 rounded border border-border">
                    {property.address}
                  </p>
                </div>
              )}
              {property.landmark && (
                <div>
                  <span className="text-text-muted block font-medium mb-0.5">Landmark</span>
                  <p className="text-text-secondary leading-relaxed bg-bg-primary p-2.5 rounded border border-border">
                    {property.landmark}
                  </p>
                </div>
              )}

              {property.virtualTourUrl && (
                <div className="pt-2">
                  <a
                    href={property.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-accent/10 border border-accent/20 px-3 py-2.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                  >
                    <ExternalLink size={13} />
                    Open Virtual Tour
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <PropertyMap
        latitude={property.latitude ?? null}
        longitude={property.longitude ?? null}
        address={property.address ?? null}
        landmark={property.landmark ?? null}
        propertyTitle={property.title}
        heightClassName="h-[420px] md:h-[520px]"
      />
    </div>
  );
}
