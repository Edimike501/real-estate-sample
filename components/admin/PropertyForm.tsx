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

import { MapPicker } from "@/components/admin/MapPicker";
import { AppSelect } from "@/components/ui/app-select";
import { type Property, type PropertyMedia } from "@/types";
import { ListingType, MediaType, PropertyStatus } from "@/types/enums";

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
    const payload = Object.fromEntries(formData.entries());

    // Add location data to payload
    if (latitude !== undefined) payload.latitude = latitude;
    if (longitude !== undefined) payload.longitude = longitude;
    payload.address = address;
    payload.landmark = landmark;

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
    <div className="space-y-4">
      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-lg border border-border bg-bg-secondary p-4">
        <input
          name="slug"
          defaultValue={property?.slug}
          placeholder="Slug"
          required
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
        />
        <input
          name="title"
          defaultValue={property?.title}
          placeholder="Title"
          required
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
        />
        <textarea
          name="description"
          defaultValue={property?.description}
          placeholder="Description"
          required
          className="min-h-28 w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
        />
        <AppSelect
          name="listingType"
          defaultValue={String(property?.listingType ?? ListingType.SALE)}
          placeholder="Listing Type"
          options={Object.values(ListingType).map((value) => ({
            value,
            label: value
          }))}
        />
        <AppSelect
          name="status"
          defaultValue={String(property?.status ?? PropertyStatus.AVAILABLE)}
          placeholder="Property Status"
          options={Object.values(PropertyStatus).map((value) => ({
            value,
            label: value
          }))}
        />
        <input
          name="city"
          defaultValue={property?.city}
          placeholder="City"
          required
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
        />
        <input
          name="state"
          defaultValue={property?.state ?? "Lagos"}
          placeholder="State"
          required
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
        />
        <input
          name="country"
          defaultValue={property?.country ?? "Nigeria"}
          placeholder="Country"
          required
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
        />

        <div className="space-y-3 rounded-lg border border-border/50 bg-bg-primary p-4">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-semibold text-text-primary mb-2">
              Street Address
            </label>
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., 123 Main Street, Victoria Island"
              className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="landmark"
              className="block text-sm font-semibold text-text-primary mb-2">
              Landmark / Area
            </label>
            <input
              id="landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g., Near Lekki Phase 1 Gate"
              className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Location on Map
            </label>
            <MapPicker
              initialLat={latitude}
              initialLng={longitude}
              onLocationChange={(lat, lng, reverseGeocodedAddress) => {
                setLatitude(lat);
                setLongitude(lng);
                // Only auto-fill address if empty
                if (!address && reverseGeocodedAddress) {
                  setAddress(reverseGeocodedAddress);
                }
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">
          Save Property
        </button>
        {formStatus ? (
          <p className="text-sm text-text-secondary">{formStatus}</p>
        ) : null}
      </form>

      {property ? (
        <form
          onSubmit={uploadStaged}
          className="overflow-hidden rounded-lg border border-border bg-bg-secondary">
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

          <div className="border-b border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Property media
                </h2>
                <p className="text-sm text-text-muted">
                  Manage images, videos, and the tour video for this property.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {staged.length ? (
                  <button
                    type="button"
                    onClick={clearStaged}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-red-400 hover:text-red-300 disabled:opacity-60">
                    <X size={16} />
                    Clear
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={!staged.length || isUploading}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                  {isUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <UploadCloud size={16} />
                  )}
                  {isUploading ? "Uploading" : "Upload selected media"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-3">
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => imageInputRef.current?.click()}
                className={`relative flex min-h-64 cursor-pointer flex-col justify-end overflow-hidden rounded-lg border border-dashed transition ${
                  isDragging
                    ? "border-accent bg-accent/10"
                    : "border-border bg-bg-primary"
                }`}>
                <div
                  className="absolute inset-0 bg-[linear-gradient(135deg,rgba(57,75,209,0.18),rgba(8,12,32,0.96))]"
                  aria-hidden="true"
                />
                <div className="relative p-5">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur">
                    <ImagePlus size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Drop property images here
                  </h3>
                  <p className="mt-1 max-w-xl text-sm text-white/75">
                    Select images here, or use the buttons below for videos and
                    tour video.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent hover:text-text-primary">
                  <ImagePlus size={16} />
                  Add images
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent hover:text-text-primary">
                  <Video size={16} />
                  Add videos
                </button>
                <button
                  type="button"
                  onClick={() => tourInputRef.current?.click()}
                  disabled={hasTourVideo}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50">
                  <Video size={16} />
                  Add tour video
                </button>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-text-primary">
                  Uploaded media
                </p>
                {media.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {media.map((item, index) => (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-lg border border-border bg-bg-primary">
                        <div className="relative aspect-video bg-bg-secondary">
                          {item.mediaType === MediaType.IMAGE ? (
                            <Image
                              src={item.thumbnailUrl || item.url}
                              alt={item.altText || property.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              controls
                              className="h-full w-full bg-black object-contain"
                            />
                          )}
                          <span className="absolute left-2 top-2 rounded-md bg-bg-primary/90 px-2 py-1 text-xs font-semibold text-text-primary">
                            {index + 1}. {getMediaLabel(item.mediaType)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 p-3">
                          <p className="min-w-0 truncate text-sm text-text-secondary">
                            {item.altText || item.publicId}
                          </p>
                          <button
                            type="button"
                            onClick={() => void deleteMedia(item)}
                            disabled={deletingId === item.id}
                            title="Remove media"
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-300 disabled:opacity-60">
                            {deletingId === item.id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-32 items-center justify-center rounded-lg border border-border bg-bg-primary p-6 text-center">
                    <p className="text-sm text-text-muted">
                      No media uploaded yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-text-primary">
                Selected previews
              </p>
              {staged.length ? (
                <div className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
                  {staged.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[88px_1fr_auto] gap-3 rounded-lg border border-border bg-bg-primary p-2">
                      {item.mediaType === MediaType.IMAGE ? (
                        <div
                          className="h-20 rounded-md bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.previewUrl})` }}
                          aria-label={item.file.name}
                        />
                      ) : (
                        <video
                          src={item.previewUrl}
                          className="h-20 rounded-md bg-black object-cover"
                          muted
                        />
                      )}
                      <div className="min-w-0 space-y-2">
                        <div>
                          <p className="truncate text-sm font-semibold text-text-primary">
                            {index + 1}. {item.file.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {getMediaLabel(item.mediaType)} /{" "}
                            {formatFileSize(item.file.size)}
                          </p>
                        </div>
                        <input
                          value={item.altText}
                          onChange={(event) =>
                            updateAltText(item.id, event.target.value)
                          }
                          placeholder="Alt text"
                          className="w-full rounded-md border border-border bg-bg-secondary px-2 py-1.5 text-xs text-text-primary"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStaged(item.id)}
                        disabled={isUploading}
                        title="Remove selection"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-300 disabled:opacity-60">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-48 items-center justify-center rounded-lg border border-border bg-bg-primary p-6 text-center">
                  <p className="text-sm text-text-muted">
                    No files selected yet.
                  </p>
                </div>
              )}
              {mediaStatus ? (
                <p className="text-sm text-text-secondary">{mediaStatus}</p>
              ) : null}
            </div>
          </div>
        </form>
      ) : (
        <section className="rounded-lg border border-border bg-bg-secondary p-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Property media
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Save the property first to upload images, videos, and a tour video.
          </p>
        </section>
      )}
    </div>
  );
}
