"use client";

import {
  ImagePlus,
  Loader2,
  Trash2,
  UploadCloud,
  Video,
  X
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useRef,
  useState
} from "react";

import { AppSelect } from "@/components/ui/app-select";
import { formatEnum } from "@/lib/utils";
import { type Property, type PropertyMedia } from "@/types";
import { ListingType, MediaType, PropertyStatus } from "@/types/enums";
import dynamic from "next/dynamic";

const MapPicker = dynamic(
  () => import("./MapPicker").then((mod) => mod.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full animate-pulse bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 text-sm border border-slate-800">
        Initializing Interactive Map Engine...
      </div>
    )
  }
);

export type FormFieldDefinition = {
  label: string;
  name: string;
  type: "number" | "text" | "select" | "date";
  placeholder?: string;
  options?: { label: string; value: string }[];
};

export const CONDITIONAL_PROPERTY_FIELDS: Record<
  ListingType,
  FormFieldDefinition[]
> = {
  SALE: [
    {
      label: "Sale Price (₦)",
      name: "salePrice",
      type: "number",
      placeholder: "e.g. 150000000"
    },
    {
      label: "Number of Bedrooms",
      name: "bedrooms",
      type: "number",
      placeholder: "e.g. 4"
    },
    {
      label: "Number of Bathrooms",
      name: "bathrooms",
      type: "number",
      placeholder: "e.g. 5"
    },
    {
      label: "Number of Toilets",
      name: "toilets",
      type: "number",
      placeholder: "e.g. 5"
    },
    {
      label: "Property Internal Size (Sqm)",
      name: "sizeSqm",
      type: "number",
      placeholder: "e.g. 450"
    }
  ],
  RENTAL: [
    {
      label: "Rental Price (₦)",
      name: "rentalPrice",
      type: "number",
      placeholder: "e.g. 12000000"
    },
    {
      label: "Price Frequency / Cycle",
      name: "priceFrequency",
      type: "select",
      options: [
        { label: "One-Off Payment", value: "ONE_OFF" },
        { label: "Per Month", value: "PER_MONTH" },
        { label: "Per Year / Annum", value: "PER_YEAR" }
      ]
    },
    { label: "Available From Date", name: "availableFrom", type: "date" },
    {
      label: "Lease Duration / Terms",
      name: "leaseTerm",
      type: "text",
      placeholder: "e.g. 2 Years Minimum Advance"
    },
    {
      label: "Service Charge (₦)",
      name: "serviceCharge",
      type: "number",
      placeholder: "e.g. 1500000"
    },
    {
      label: "Caution Fee Deposit (₦)",
      name: "cautionFee",
      type: "number",
      placeholder: "e.g. 500000"
    },
    {
      label: "Property Internal Size (Sqm)",
      name: "sizeSqm",
      type: "number",
      placeholder: "e.g. 220"
    },
    { label: "Number of Bedrooms", name: "bedrooms", type: "number" },
    { label: "Number of Bathrooms", name: "bathrooms", type: "number" }
  ],
  LAND: [
    {
      label: "Land Purchase Price (₦)",
      name: "salePrice",
      type: "number",
      placeholder: "e.g. 85000000"
    },
    {
      label: "Total Land Size (Sqm)",
      name: "landSizeSqm",
      type: "number",
      placeholder: "e.g. 600"
    },
    {
      label: "Legal Land Title Type",
      name: "titleType",
      type: "text",
      placeholder: "e.g. Certificate of Ownership (C of O), Governor's Consent"
    }
  ],
  DEVELOPMENT: [
    {
      label: "Project Startup Launch Price (₦)",
      name: "salePrice",
      type: "number",
      placeholder: "e.g. 210000000"
    },
    {
      label: "Target Completion / Phase Timeline",
      name: "leaseTerm",
      type: "text",
      placeholder: "e.g. Q4 2027 Off-Plan"
    },
    {
      label: "Available Structural Typologies",
      name: "titleType",
      type: "text",
      placeholder: "e.g. 4 Bed Terraces, 5 Bed Fully Detached"
    },
    {
      label: "Total Expected Site Units / Sizes",
      name: "landSizeSqm",
      type: "number"
    }
  ]
};

type PropertyFormProps = {
  property?: Property;
};

type StagedMedia = {
  id: string;
  file: File;
  previewUrl: string;
  altText: string;
  mediaType: MediaType;
};

type UploadResponse = PropertyMedia & {
  success: boolean;
  error?: string;
};

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getMediaLabel(mediaType: MediaType | `${MediaType}`) {
  if (mediaType === MediaType.TOUR) return "Tour video";
  if (mediaType === MediaType.VIDEO) return "Video";
  return "Image";
}

function getDefaultAltText(file: File) {
  return file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
}

function formatDateForInput(dateVal: Date | string | undefined | null) {
  if (!dateVal) return "";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const tourInputRef = useRef<HTMLInputElement>(null);
  const [formStatus, setFormStatus] = useState<string>("");
  const [mediaStatus, setMediaStatus] = useState<string>("");
  const [media, setMedia] = useState<PropertyMedia[]>(property?.media ?? []);
  const [staged, setStaged] = useState<StagedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | undefined>(
    property?.latitude ?? undefined
  );
  const [longitude, setLongitude] = useState<number | undefined>(
    property?.longitude ?? undefined
  );
  const [address, setAddress] = useState<string>(property?.address ?? "");
  const [landmark, setLandmark] = useState<string>(property?.landmark ?? "");
  const [listingType, setListingType] = useState<ListingType>(
    (property?.listingType as ListingType) ?? ListingType.SALE
  );
  const isEditing = Boolean(property);
  const hasTourVideo =
    media.some((item) => item.mediaType === MediaType.TOUR) ||
    staged.some((item) => item.mediaType === MediaType.TOUR);

  useEffect(() => {
    return () => {
      staged.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [staged]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<
      string,
      unknown
    >;

    // Add location data to payload
    if (latitude !== undefined) payload.latitude = latitude;
    if (longitude !== undefined) payload.longitude = longitude;
    payload.address = address;
    payload.landmark = landmark;

    // Define all conditional fields we want to track
    const allConditionalFields = [
      "salePrice",
      "bedrooms",
      "bathrooms",
      "toilets",
      "sizeSqm",
      "rentalPrice",
      "priceFrequency",
      "availableFrom",
      "leaseTerm",
      "serviceCharge",
      "cautionFee",
      "landSizeSqm",
      "titleType"
    ];

    // Find the fields that belong to the active listing type
    const activeFields = CONDITIONAL_PROPERTY_FIELDS[listingType].map(
      (f) => f.name
    );

    // Clean and validate form inputs based on conditional fields
    for (const field of allConditionalFields) {
      if (!activeFields.includes(field)) {
        payload[field] = null;
      } else {
        if (payload[field] === "" || payload[field] === undefined) {
          payload[field] = null;
        } else {
          // Coerce number fields to numeric values on client side
          const fieldDef = CONDITIONAL_PROPERTY_FIELDS[listingType].find(
            (f) => f.name === field
          );
          if (fieldDef?.type === "number") {
            payload[field] = Number(payload[field]);
          }
        }
      }
    }

    const response = await fetch(
      isEditing ? `/api/properties/${property?.id}` : "/api/properties",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = (await response.json().catch(() => null)) as {
      property?: { id: string };
      error?: unknown;
    } | null;

    if (response.ok) {
      setFormStatus(
        isEditing
          ? "Property saved."
          : "Property saved. Opening media editor..."
      );
      if (!isEditing && data?.property?.id) {
        router.push(`/admin/dashboard/properties/${data.property.id}/edit`);
        router.refresh();
        return;
      }
      router.refresh();
      return;
    }

    setFormStatus(
      typeof data?.error === "string" ? data.error : "Failed to save property."
    );
  }

  function stageFiles(files: FileList | File[], mediaType: MediaType) {
    if (mediaType === MediaType.TOUR && hasTourVideo) {
      setMediaStatus(
        "Remove the existing tour video before adding another one."
      );
      return;
    }

    const allowedPrefix = mediaType === MediaType.IMAGE ? "image/" : "video/";
    const selectedFiles = Array.from(files).filter((file) =>
      file.type.startsWith(allowedPrefix)
    );
    const nextFiles =
      mediaType === MediaType.TOUR ? selectedFiles.slice(0, 1) : selectedFiles;

    if (!nextFiles.length) {
      setMediaStatus(
        mediaType === MediaType.IMAGE
          ? "Choose at least one image file."
          : "Choose a video file."
      );
      return;
    }

    const nextItems = nextFiles.map((file) => ({
      id: createId(),
      file,
      previewUrl: URL.createObjectURL(file),
      altText: getDefaultAltText(file),
      mediaType
    }));

    setStaged((current) => [...current, ...nextItems]);
    setMediaStatus(
      `${nextItems.length} ${mediaType === MediaType.IMAGE ? "image" : "video"}${nextItems.length === 1 ? "" : "s"} ready to upload.`
    );
  }

  function onFileChange(
    event: ChangeEvent<HTMLInputElement>,
    mediaType: MediaType
  ) {
    if (event.target.files) stageFiles(event.target.files, mediaType);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    stageFiles(event.dataTransfer.files, MediaType.IMAGE);
  }

  function removeStaged(id: string) {
    setStaged((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function clearStaged() {
    staged.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setStaged([]);
    setMediaStatus("Selection cleared.");
  }

  function updateAltText(id: string, value: string) {
    setStaged((current) =>
      current.map((item) =>
        item.id === id ? { ...item, altText: value } : item
      )
    );
  }

  async function uploadStaged(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!property || !staged.length || isUploading) return;

    setIsUploading(true);
    setMediaStatus(
      `Uploading ${staged.length} file${staged.length === 1 ? "" : "s"}...`
    );
    const completed: PropertyMedia[] = [];

    for (const [index, item] of staged.entries()) {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("propertyId", property.id);
      formData.append("altText", item.altText);
      formData.append("mediaType", item.mediaType);
      formData.append("order", String(media.length + completed.length));

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData
      });

      const data = (await response
        .json()
        .catch(() => null)) as UploadResponse | null;

      if (!response.ok || !data) {
        setMediaStatus(
          `Upload failed on ${item.file.name}: ${data?.error ?? "The server could not process this file."}`
        );
        setIsUploading(false);
        setStaged((current) => current.slice(index));
        if (completed.length) setMedia((current) => [...current, ...completed]);
        router.refresh();
        return;
      }

      completed.push(data);
      URL.revokeObjectURL(item.previewUrl);
    }

    setMedia((current) => [...current, ...completed]);
    setStaged([]);
    setIsUploading(false);
    setMediaStatus("Media uploaded and attached to this property.");
    router.refresh();
  }

  async function deleteMedia(item: PropertyMedia) {
    if (deletingId) return;
    const confirmed = window.confirm(
      `Remove this ${getMediaLabel(item.mediaType).toLowerCase()}?`
    );
    if (!confirmed) return;

    setDeletingId(item.id);
    setMediaStatus("Deleting media...");

    const response = await fetch(`/api/media/${item.id}`, { method: "DELETE" });

    if (response.ok) {
      setMedia((current) => current.filter((entry) => entry.id !== item.id));
      setMediaStatus("Media deleted.");
      setDeletingId(null);
      router.refresh();
      return;
    }

    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    setMediaStatus(data?.error ?? "Failed to delete media.");
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      {/* 1. Property Form */}
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-1">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-text-primary">
              Property Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={property?.title}
              placeholder="e.g. Luxury 4-Bedroom Duplex"
              required
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label
              htmlFor="slug"
              className="block text-sm font-semibold text-text-primary">
              Slug / URL Identifier
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={property?.slug}
              placeholder="e.g. luxury-4-bedroom-duplex"
              required
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-text-primary">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={property?.description}
            placeholder="Detailed description of the property features, amenities, and surroundings..."
            required
            className="min-h-32 w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Listing Type */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-text-primary">
              Listing Type
            </label>
            <AppSelect
              name="listingType"
              value={listingType}
              onValueChange={(value) => {
                setListingType(value as ListingType);
              }}
              placeholder="Listing Type"
              options={Object.values(ListingType).map((value) => ({
                value,
                label: formatEnum(value)
              }))}
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-text-primary">
              Property Status
            </label>
            <AppSelect
              name="status"
              defaultValue={String(
                property?.status ?? PropertyStatus.AVAILABLE
              )}
              placeholder="Property Status"
              options={Object.values(PropertyStatus).map((value) => ({
                value,
                label: formatEnum(value)
              }))}
            />
          </div>
        </div>

        {/* Dynamic Fields */}
        {CONDITIONAL_PROPERTY_FIELDS[listingType] &&
          CONDITIONAL_PROPERTY_FIELDS[listingType].length > 0 && (
            <div
              key={listingType}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 border-t border-border/30 pt-4 mt-2">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider col-span-full mb-1">
                {formatEnum(listingType)} Specifications
              </h3>
              {CONDITIONAL_PROPERTY_FIELDS[listingType].map((field) => {
                if (field.type === "select") {
                  return (
                    <div key={field.name} className="space-y-1">
                      <label className="block text-sm font-semibold text-text-primary">
                        {field.label}
                      </label>
                      <AppSelect
                        name={field.name}
                        defaultValue={
                          property?.[field.name as keyof Property] !== null &&
                          property?.[field.name as keyof Property] !== undefined
                            ? String(property[field.name as keyof Property])
                            : ""
                        }
                        placeholder={field.placeholder || field.label}
                        options={field.options || []}
                      />
                    </div>
                  );
                }

                if (field.type === "date") {
                  return (
                    <div key={field.name} className="space-y-1">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-semibold text-text-primary">
                        {field.label}
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type="date"
                        defaultValue={
                          property?.[field.name as keyof Property]
                            ? formatDateForInput(
                                property[field.name as keyof Property]
                              )
                            : ""
                        }
                        className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                  );
                }

                return (
                  <div key={field.name} className="space-y-1">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-semibold text-text-primary">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      defaultValue={
                        property?.[field.name as keyof Property] !== null &&
                        property?.[field.name as keyof Property] !== undefined
                          ? String(property[field.name as keyof Property])
                          : ""
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>
          )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* City */}
          <div className="space-y-1">
            <label
              htmlFor="city"
              className="block text-sm font-semibold text-text-primary">
              City
            </label>
            <input
              id="city"
              name="city"
              defaultValue={property?.city}
              placeholder="e.g. Lekki"
              required
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          {/* State */}
          <div className="space-y-1">
            <label
              htmlFor="state"
              className="block text-sm font-semibold text-text-primary">
              State
            </label>
            <input
              id="state"
              name="state"
              defaultValue={property?.state ?? "Lagos"}
              placeholder="e.g. Lagos"
              required
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-text-primary">
              Country
            </label>
            <input
              id="country"
              name="country"
              defaultValue={property?.country ?? "Nigeria"}
              placeholder="e.g. Nigeria"
              required
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Location Sub-Card */}
        <div className="space-y-4 rounded-lg border border-border/50 bg-bg-primary p-4 mt-2">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border/50 pb-2">
            Detailed Location & Coordinates
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-text-primary mb-1">
                Street Address
              </label>
              <input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 123 Main Street, Victoria Island"
                className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="landmark"
                className="block text-sm font-semibold text-text-primary mb-1">
                Landmark / Area
              </label>
              <input
                id="landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g., Near Lekki Phase 1 Gate"
                className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Select Location on Map
            </label>
            <div className="rounded-lg border border-border overflow-hidden bg-bg-secondary">
              <MapPicker
                initialLat={latitude}
                initialLng={longitude}
                onLocationChange={(lat, lng, reverseGeocodedAddress) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  if (!address && reverseGeocodedAddress) {
                    setAddress(reverseGeocodedAddress);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-border flex items-center gap-4 flex-wrap">
          <button
            type="submit"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition cursor-pointer">
            Save Property
          </button>
          {formStatus ? (
            <p
              className={`text-xs font-semibold ${formStatus.includes("saved") ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
              {formStatus}
            </p>
          ) : null}
        </div>
      </form>

      {/* 2. Media Section */}
      {property ? (
        <form
          onSubmit={uploadStaged}
          className="overflow-hidden rounded-lg border border-border bg-bg-secondary shadow-sm">
          {/* File Inputs (Hidden) */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => onFileChange(event, MediaType.IMAGE)}
            className="sr-only"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={(event) => onFileChange(event, MediaType.VIDEO)}
            className="sr-only"
          />
          <input
            ref={tourInputRef}
            type="file"
            accept="video/*"
            onChange={(event) => onFileChange(event, MediaType.TOUR)}
            className="sr-only"
          />

          {/* Media Header */}
          <div className="border-b border-border p-4 bg-bg-secondary">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Property Media Manager
                </h2>
                <p className="text-xs text-text-muted">
                  Attach HD images, walk-through videos, or virtual tours to
                  this property listing.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {staged.length ? (
                  <button
                    type="button"
                    onClick={clearStaged}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-red-400 hover:text-red-500 bg-bg-primary disabled:opacity-60">
                    <X size={14} />
                    Cancel
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={!staged.length || isUploading}
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm">
                  {isUploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <UploadCloud size={14} />
                  )}
                  {isUploading ? "Uploading..." : "Upload Selection"}
                </button>
              </div>
            </div>
          </div>

          {/* Media Interactive Area */}
          <div className="grid gap-5 p-4 lg:grid-cols-2">
            {/* Left: Upload and Controls */}
            <div className="space-y-4">
              {/* Drag Zone */}
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => imageInputRef.current?.click()}
                className={`relative flex min-h-52 cursor-pointer flex-col justify-end overflow-hidden rounded-lg border border-dashed transition ${
                  isDragging
                    ? "border-accent bg-accent/10"
                    : "border-border bg-bg-primary hover:border-accent/40"
                }`}>
                <div
                  className="absolute inset-0 bg-[linear-gradient(135deg,rgba(57,75,209,0.06),rgba(8,12,32,0.92))]"
                  aria-hidden="true"
                />
                <div className="relative p-4 text-white">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur">
                    <ImagePlus size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">
                    Drag & Drop Property Images
                  </h3>
                  <p className="mt-0.5 text-xs text-white/70">
                    Or click here to browse files. Use controls below to upload
                    video/tours.
                  </p>
                </div>
              </div>

              {/* Upload Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2.5 text-xs font-semibold text-text-secondary bg-bg-primary transition hover:border-accent hover:text-text-primary">
                  <ImagePlus size={14} />
                  Add Images
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2.5 text-xs font-semibold text-text-secondary bg-bg-primary transition hover:border-accent hover:text-text-primary">
                  <Video size={14} />
                  Add Videos
                </button>
                <button
                  type="button"
                  onClick={() => tourInputRef.current?.click()}
                  disabled={hasTourVideo}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2.5 text-xs font-semibold text-text-secondary bg-bg-primary transition hover:border-accent hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50">
                  <Video size={14} />
                  Add Tour Video
                </button>
              </div>

              {/* Uploaded Gallery */}
              <div className="pt-2 border-t border-border/80">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                  Attached Gallery ({media.length})
                </p>
                {media.length ? (
                  <div className="grid gap-3 sm:grid-cols-2 max-h-96 overflow-y-auto pr-1">
                    {media.map((item, index) => (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-lg border border-border bg-bg-primary flex flex-col justify-between shadow-xs">
                        <div className="relative aspect-video bg-bg-secondary">
                          {item.mediaType === MediaType.IMAGE ? (
                            <Image
                              src={item.thumbnailUrl || item.url}
                              alt={item.altText || property.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 30vw"
                              className="object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              controls
                              className="h-full w-full bg-black object-contain"
                            />
                          )}
                          <span className="absolute left-1.5 top-1.5 rounded bg-bg-primary/90 px-1.5 py-0.5 text-[10px] font-bold text-text-primary border border-border">
                            {index + 1}. {getMediaLabel(item.mediaType)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 p-2 bg-bg-secondary/30">
                          <p className="min-w-0 truncate text-xs text-text-secondary">
                            {item.altText || item.publicId}
                          </p>
                          <button
                            type="button"
                            onClick={() => void deleteMedia(item)}
                            disabled={deletingId === item.id}
                            title="Remove media"
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-500 bg-bg-primary disabled:opacity-60">
                            {deletingId === item.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-bg-primary p-4 text-center">
                    <p className="text-xs text-text-muted">
                      No media files uploaded yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Selected Selection Queue */}
            <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-border/80 lg:pl-5 pt-4 lg:pt-0">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Selected Previews Queue ({staged.length})
              </p>
              {staged.length ? (
                <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-1">
                  {staged.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[80px_1fr_auto] gap-3 rounded-lg border border-border bg-bg-primary p-2 items-center">
                      {item.mediaType === MediaType.IMAGE ? (
                        <div
                          className="h-16 rounded bg-cover bg-center border border-border"
                          style={{ backgroundImage: `url(${item.previewUrl})` }}
                          aria-label={item.file.name}
                        />
                      ) : (
                        <video
                          src={item.previewUrl}
                          className="h-16 rounded bg-black object-cover border border-border"
                          muted
                        />
                      )}
                      <div className="min-w-0 space-y-1.5">
                        <div>
                          <p className="truncate text-xs font-semibold text-text-primary">
                            {index + 1}. {item.file.name}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            {getMediaLabel(item.mediaType)} /{" "}
                            {formatFileSize(item.file.size)}
                          </p>
                        </div>
                        <input
                          value={item.altText}
                          onChange={(event) =>
                            updateAltText(item.id, event.target.value)
                          }
                          placeholder="Alt description text (highly recommended)"
                          className="w-full rounded border border-border bg-bg-secondary px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStaged(item.id)}
                        disabled={isUploading}
                        title="Remove selection"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary bg-bg-primary transition hover:border-red-400 hover:text-red-500 disabled:opacity-60">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-48 items-center justify-center rounded-lg border border-border bg-bg-primary p-6 text-center">
                  <p className="text-xs text-text-muted">
                    Your upload queue is currently empty.
                  </p>
                </div>
              )}
              {mediaStatus ? (
                <p className="text-xs font-semibold text-text-secondary bg-bg-primary/50 border border-border p-2 rounded text-center">
                  {mediaStatus}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      ) : (
        <section className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm text-center">
          <h2 className="text-base font-semibold text-text-primary">
            Property Media Manager
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            You must fill and save the property details above before you can
            upload media.
          </p>
        </section>
      )}
    </div>
  );
}
