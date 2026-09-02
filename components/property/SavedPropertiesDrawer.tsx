"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { BackButton } from "@/components/ui/BackButton";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSavedProperties } from "@/hooks/useProperties";
import { type Property, type PropertyMedia } from "@/types";
import { MediaType } from "@/types/enums";

interface SavedPropertiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedPropertiesDrawer({
  isOpen,
  onClose
}: SavedPropertiesDrawerProps) {
  const { bookmarks, toggleBookmark, clearBookmarks, isInitialized } =
    useBookmarks();
  const { data: properties = [], isLoading } = useSavedProperties(
    isInitialized ? bookmarks : []
  );

  // Sync scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-70 h-full w-full max-w-md bg-bg-primary shadow-2xl flex flex-col border-l border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3 min-w-0">
                <BackButton
                  href="/"
                  label="Close"
                  variant="minimal"
                  onClick={onClose}
                />
                <h2 className="text-lg font-bold text-text-primary font-display uppercase tracking-wider truncate">
                  Saved Properties ({bookmarks.length})
                </h2>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading && properties.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-3 animate-pulse">
                      <div className="w-20 h-20 bg-bg-tertiary rounded-md" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-bg-tertiary rounded w-3/4" />
                        <div className="h-3 bg-bg-tertiary rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-64 space-y-3">
                  <div className="text-text-muted text-4xl">❤️</div>
                  <h3 className="font-semibold text-text-primary">
                    No saved properties yet
                  </h3>
                  <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                    Tap the heart icon on any listing to save it and view it
                    here later.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {properties.map((property: Property) => {
                    const firstImageMedia = property.media?.find(
                      (item: PropertyMedia) =>
                        item.mediaType === MediaType.IMAGE
                    );
                    const thumbnail =
                      firstImageMedia?.thumbnailUrl ||
                      firstImageMedia?.url ||
                      property.image ||
                      "";

                    return (
                      <div
                        key={property.id}
                        className="flex gap-3 p-2 rounded-lg border border-border bg-bg-secondary/40 hover:bg-bg-secondary transition group relative">
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 bg-bg-tertiary">
                          <CloudinaryImage
                            src={thumbnail}
                            alt={property.title}
                            width={160}
                            height={160}
                            className="object-cover h-full w-full"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0 pr-8">
                          <div>
                            <h4 className="font-semibold text-sm text-text-primary truncate group-hover:text-accent transition">
                              {property.title}
                            </h4>
                            <p className="text-[11px] text-text-muted truncate">
                              {property.city}, {property.state}
                            </p>
                          </div>
                          <Link
                            href={`/properties/${property.slug}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1 text-xs text-accent font-semibold hover:underline">
                            <span>View Property</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => toggleBookmark(property.id)}
                          className="absolute top-2 right-2 p-1 text-text-muted hover:text-accent rounded transition cursor-pointer"
                          aria-label="Remove bookmark">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {bookmarks.length > 0 && (
              <div className="p-4 border-t border-border bg-bg-secondary/20 space-y-2">
                <button
                  onClick={() => {
                    toast.warning("Confirm Action", {
                      description:
                        "Are you sure you want to clear all bookmarks?",
                      action: {
                        label: "Clear All",
                        onClick: () => {
                          clearBookmarks();
                          toast.success("Bookmarks cleared successfully.");
                        }
                      },
                      cancel: {
                        label: "Cancel",
                        onClick: () => {}
                      }
                    });
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-bg-primary px-4 py-2.5 text-xs font-semibold text-accent hover:bg-bg-secondary transition cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
