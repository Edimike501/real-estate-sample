"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type CloudinaryTransform = {
  width?: number;
  height?: number;
  quality?: number | "auto";
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "fill" | "fit" | "scale" | "thumb" | "pad";
  gravity?: "auto" | "face" | "center";
  blur?: number;
};

type CloudinaryImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  transforms?: CloudinaryTransform;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  sizes?: string;
};

function buildCloudinaryUrl(src: string, transforms: CloudinaryTransform): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
    blur,
  } = transforms;

  if (!src.includes("/upload/")) {
    return src;
  }

  const parts: string[] = [];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop) parts.push(`c_${crop}`);
  if (gravity) parts.push(`g_${gravity}`);
  if (blur) parts.push(`e_blur:${blur}`);
  parts.push(`q_${quality}`);
  parts.push(`f_${format}`);

  const transform = parts.join(",");
  return src.replace("/upload/", `/upload/${transform}/`);
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  transforms = {},
  className,
  priority = false,
  fallbackSrc = "/images/property-placeholder.png",
  onLoad,
  sizes,
}: CloudinaryImageProps) {
  const transformedSrc = useMemo(
    () => (src ? buildCloudinaryUrl(src, { width, height, ...transforms }) : fallbackSrc),
    [fallbackSrc, height, src, transforms, width]
  );

  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(transformedSrc);
  const [isLoading, setIsLoading] = useState(true);

  if (transformedSrc !== prevSrc) {
    setPrevSrc(transformedSrc);
    setHasError(false);
    setIsLoading(true);
  }

  const currentSrc = hasError ? fallbackSrc : transformedSrc;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && <div className="absolute inset-0 animate-pulse bg-bg-secondary" aria-hidden="true" />}
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes ?? `(max-width: 768px) 100vw, ${width}px`}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
