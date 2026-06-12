"use client";

import { Play, Video } from "lucide-react";
import { useState } from "react";

import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { type Property, type PropertyMedia } from "@/types";
import { MediaType } from "@/types/enums";

import { ListingTypeBadge } from "./ListingTypeBadge";
import { PriceDropdown } from "./PriceDropdown";

type PropertyDetailHeroProps = {
  property: Property;
};

function isVideoMedia(media?: PropertyMedia) {
  return (
    media?.mediaType === MediaType.VIDEO || media?.mediaType === MediaType.TOUR
  );
}

function getMediaLabel(media?: PropertyMedia) {
  if (media?.mediaType === MediaType.TOUR) return "Tour video";
  if (media?.mediaType === MediaType.VIDEO) return "Video";
  return "Image";
}

export function PropertyDetailHero({ property }: PropertyDetailHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const media = property.media ?? [];
  const activeMedia = media[activeIndex];
  const activeSrc = activeMedia?.url ?? property.image ?? "";

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-bg-secondary">
        {isVideoMedia(activeMedia) ? (
          <video
            key={activeMedia?.id}
            src={activeSrc}
            controls
            playsInline
            className="aspect-video w-full bg-black object-contain"
          />
        ) : (
          <CloudinaryImage
            key={activeMedia?.id}
            src={activeSrc}
            alt={activeMedia?.altText || property.title}
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
            priority
          />
        )}
        {activeMedia ? (
          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md bg-bg-primary/90 px-3 py-1.5 text-xs font-semibold text-text-primary backdrop-blur">
            {isVideoMedia(activeMedia) ? <Video size={14} /> : null}
            {getMediaLabel(activeMedia)}
          </div>
        ) : null}
      </div>

      {media.length > 1 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {media.map((item, index) => {
            const isVideo = isVideoMedia(item);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-video overflow-hidden rounded-md border bg-bg-secondary transition ${
                  activeIndex === index
                    ? "border-accent ring-2 ring-accent/30"
                    : "border-border hover:border-accent/70"
                }`}
                aria-label={`Preview ${getMediaLabel(item).toLowerCase()} ${index + 1}`}>
                {isVideo ? (
                  <>
                    <video
                      src={item.url}
                      muted
                      preload="metadata"
                      className="h-full w-full bg-black object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
                      <Play size={22} fill="currentColor" />
                    </span>
                  </>
                ) : (
                  <CloudinaryImage
                    src={item.thumbnailUrl || item.url}
                    alt={item.altText || property.title}
                    width={320}
                    height={220}
                    className="h-full w-full object-cover"
                  />
                )}
                <span className="absolute bottom-1 left-1 rounded bg-bg-primary/90 px-2 py-0.5 text-[11px] font-semibold text-text-primary">
                  {getMediaLabel(item)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="space-y-2">
        <ListingTypeBadge
          listingType={property.listingType}
          status={property.status}
        />
        <h1 className="text-3xl font-bold text-text-primary">
          {property.title}
        </h1>
        <p className="text-text-secondary">
          {property.city}, {property.state}, {property.country}
        </p>
        <PriceDropdown property={property} />
      </div>
    </section>
  );
}
