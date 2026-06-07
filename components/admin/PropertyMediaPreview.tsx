"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Award, Eye, MapPin, Video } from "lucide-react";

import { MediaType } from "@/types/enums";
import { formatEnum } from "@/lib/utils";

type PreviewMedia = {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  mediaType: MediaType | `${MediaType}`;
  altText?: string | null;
};

type PropertyMediaPreviewProps = {
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  media?: PreviewMedia[];
  status: string;
  statusClass: string;
  listingType: string;
  isFeatured: boolean;
};

export function PropertyMediaPreview({
  title,
  description,
  city,
  state,
  country,
  media = [],
  status,
  statusClass,
  listingType,
  isFeatured
}: PropertyMediaPreviewProps) {
  const [selectedId, setSelectedId] = useState(media[0]?.id ?? null);
  const selectedMedia = useMemo(
    () => media.find((item) => item.id === selectedId) ?? media[0],
    [media, selectedId]
  );
  const selectedImage =
    selectedMedia?.thumbnailUrl ?? selectedMedia?.url ?? "/images/property-placeholder.png";
  const selectedAlt = selectedMedia?.altText || title;
  const isVideo =
    selectedMedia?.mediaType === MediaType.VIDEO ||
    selectedMedia?.mediaType === MediaType.TOUR;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-border bg-bg-secondary shadow-sm">
        <div className="relative aspect-video w-full bg-bg-tertiary">
          {isVideo && selectedMedia ? (
            <video
              src={selectedMedia.url}
              controls
              className="h-full w-full bg-black object-contain"
            />
          ) : (
            <Image
              src={selectedImage}
              alt={selectedAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          )}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>
              {formatEnum(status)}
            </span>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-sm">
              {formatEnum(listingType)}
            </span>
            {isFeatured && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                <Award size={12} className="fill-white" />
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary leading-tight">
              {title}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
              <MapPin size={14} className="text-text-muted" />
              {city}, {state}, {country}
            </p>
          </div>

          <div className="border-t border-border/80 pt-4">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-text-muted">
              Description
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
          </div>
        </div>
      </div>

      {media.length > 0 && (
        <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-4">
          <h3 className="border-b border-border/80 pb-2 text-sm font-bold uppercase tracking-wider text-text-muted">
            Property Gallery ({media.length} files)
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {media.map((item, index) => {
              const itemIsVideo =
                item.mediaType === MediaType.VIDEO || item.mediaType === MediaType.TOUR;
              const isSelected = selectedMedia?.id === item.id;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`group relative aspect-video overflow-hidden rounded-md border bg-bg-primary text-left shadow-xs transition ${
                    isSelected
                      ? "border-accent ring-2 ring-accent/25"
                      : "border-border hover:border-accent/60 hover:shadow-md"
                  }`}
                  aria-label={`Preview ${item.altText || `${title} media ${index + 1}`}`}
                >
                  {itemIsVideo ? (
                    <div className="flex h-full w-full items-center justify-center bg-black text-white">
                      <Video size={24} />
                    </div>
                  ) : (
                    <Image
                      src={item.thumbnailUrl || item.url}
                      alt={item.altText || `${title} media ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 20vw"
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center gap-1 bg-black/45 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Eye size={14} />
                    Preview
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
