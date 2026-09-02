"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play, Video, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { type Property, type PropertyMedia } from "@/types";
import { MediaType } from "@/types/enums";

import { useCurrency } from "@/context/CurrencyContext";
import { timeAgo } from "@/lib/timeAgo";
import CurrencyToggle from "./CurrencyToggle";
import { ListingTypeBadge } from "./ListingTypeBadge";
import PriceDisplay from "./PriceDisplay";

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
  const { currency, setCurrency, rates, lastUpdated } = useCurrency();
  const media = property.media ?? [];

  // Carousel state
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxRef, lightboxApi] = useEmblaCarousel({
    loop: true,
    startIndex: selectedIndex
  });

  // Update selected index & snaps on embla events
  const onInit = useCallback((api: UseEmblaCarouselType[1]) => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  const onSelect = useCallback((api: UseEmblaCarouselType[1]) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);

    emblaApi.reInit();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi, onInit, onSelect]);

  useEffect(() => {
    if (!lightboxApi) return;
    const handleLightboxSelect = () => {
      setSelectedIndex(lightboxApi.selectedScrollSnap());
    };
    lightboxApi.on("select", handleLightboxSelect);
    return () => {
      lightboxApi.off("select", handleLightboxSelect);
    };
  }, [lightboxApi]);

  // Sync index if lightbox is opened
  useEffect(() => {
    if (lightboxOpen && lightboxApi && emblaApi) {
      lightboxApi.scrollTo(emblaApi.selectedScrollSnap(), true);
    }
  }, [lightboxOpen, lightboxApi, emblaApi]);

  // Keydown listener for escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    if (lightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const lightboxPrev = useCallback(
    () => lightboxApi && lightboxApi.scrollPrev(),
    [lightboxApi]
  );
  const lightboxNext = useCallback(
    () => lightboxApi && lightboxApi.scrollNext(),
    [lightboxApi]
  );

  return (
    <section className="space-y-4">
      {/* Embla Gallery Wrapper */}
      <div className="relative group">
        <div
          className="overflow-hidden rounded-xl bg-bg-secondary"
          ref={emblaRef}>
          <div className="flex">
            {media.length > 0 ? (
              media.map((item, index) => (
                <div
                  key={item.id}
                  className="flex-[0_0_100%] min-w-0 relative aspect-video cursor-pointer select-none"
                  onClick={() => {
                    setSelectedIndex(index);
                    setLightboxOpen(true);
                  }}>
                  {isVideoMedia(item) ? (
                    <div className="relative h-full w-full bg-black">
                      <video
                        src={item.url}
                        controls
                        playsInline
                        className="h-full w-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  ) : (
                    <CloudinaryImage
                      src={item.url}
                      alt={item.altText || property.title}
                      width={1600}
                      height={900}
                      className="h-full w-full object-cover"
                      priority={index === 0}
                    />
                  )}
                  <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md bg-bg-primary/90 px-3 py-1.5 text-xs font-semibold text-text-primary backdrop-blur shadow-sm">
                    {isVideoMedia(item) ? <Video size={14} /> : null}
                    {getMediaLabel(item)}
                  </div>
                </div>
              ))
            ) : (
              // Fallback if no media
              <div className="flex-[0_0_100%] min-w-0 aspect-video relative">
                <CloudinaryImage
                  src={property.image || ""}
                  alt={property.title}
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>

        {/* Carousel Arrow Controls (Desktop Only) */}
        {media.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-bg-primary/80 text-text-primary hover:bg-bg-primary shadow-md transition cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-bg-primary/80 text-text-primary hover:bg-bg-primary shadow-md transition cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {media.length > 1 && (
        <div className="flex justify-center gap-1.5 py-1">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                selectedIndex === index
                  ? "w-6 bg-accent"
                  : "w-2 bg-text-muted/40 hover:bg-text-muted/65"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip (Desktop Only) */}
      {media.length > 1 && (
        <div className="hidden md:grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
          {media.map((item, index) => {
            const isVideo = isVideoMedia(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(index)}
                className={`relative aspect-video overflow-hidden rounded-md border bg-bg-secondary transition cursor-pointer ${
                  selectedIndex === index
                    ? "border-accent ring-2 ring-accent/30"
                    : "border-border hover:border-accent/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}>
                {isVideo ? (
                  <div className="h-full w-full relative bg-black">
                    <Play
                      className="absolute inset-0 m-auto text-white w-6 h-6 z-10"
                      fill="currentColor"
                    />
                    <video
                      src={item.url}
                      muted
                      className="h-full w-full object-cover opacity-60"
                    />
                  </div>
                ) : (
                  <CloudinaryImage
                    src={item.thumbnailUrl || item.url}
                    alt={item.altText || property.title}
                    width={1600}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Overlay */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-100 flex flex-col bg-black/95 text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 z-50">
            <span className="text-sm font-semibold tracking-wider">
              {selectedIndex + 1} / {media.length || 1}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition cursor-pointer"
              aria-label="Close fullscreen gallery">
              <X size={24} />
            </button>
          </div>

          {/* Lightbox Swipeable Gallery */}
          <div className="flex-1 overflow-hidden" ref={lightboxRef}>
            <div className="flex h-full items-center">
              {media.length > 0 ? (
                media.map((item) => (
                  <div
                    key={`lb-${item.id}`}
                    className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center p-4 select-none relative">
                    {isVideoMedia(item) ? (
                      <video
                        src={item.url}
                        controls
                        playsInline
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <CloudinaryImage
                        src={item.url}
                        alt={item.altText || property.title}
                        width={1920}
                        height={1080}
                        className="max-h-full max-w-full object-contain pointer-events-none"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center p-4">
                  <CloudinaryImage
                    src={property.image || ""}
                    alt={property.title}
                    width={1920}
                    height={1080}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Lightbox Navigation Buttons (Always visible inside lightbox) */}
          {media.length > 1 && (
            <>
              <button
                onClick={lightboxPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer z-50"
                aria-label="Previous">
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={lightboxNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer z-50"
                aria-label="Next">
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Property Details */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-3">
          <ListingTypeBadge
            listingType={property.listingType}
            status={property.status}
          />
          <span className="text-xs text-text-muted font-medium">
            {timeAgo(property.createdAt)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">
          {property.title}
        </h1>
        <p className="text-text-secondary text-sm">
          {property.city}, {property.state}, {property.country}
        </p>

        <CurrencyToggle selected={currency} onChange={setCurrency} />

        <PriceDisplay
          ngnAmount={
            property.listingType === "RENTAL"
              ? property.rentalPrice
              : property.salePrice
          }
          currency={currency}
          rates={rates}
          frequency={property.priceFrequency}
          negotiationStatus={property.negotiationStatus}
          size="lg"
          lastUpdated={lastUpdated}
        />
      </div>
    </section>
  );
}
