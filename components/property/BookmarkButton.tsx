"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface BookmarkButtonProps {
  propertyId: string;
  variant?: "icon" | "button";
}

export default function BookmarkButton({ propertyId, variant = "icon" }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, isInitialized } = useBookmarks();

  if (!isInitialized) {
    // Return placeholder to prevent server-client layout shifts
    return (
      <div
        className={
          variant === "button"
            ? "h-10 w-36 bg-bg-tertiary rounded-md animate-pulse"
            : "h-9 w-9 bg-bg-tertiary rounded-full animate-pulse"
        }
      />
    );
  }

  const active = isBookmarked(propertyId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(propertyId);
  };

  if (variant === "button") {
    return (
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.95 }}
        className={`inline-flex items-center gap-2 justify-center px-4 py-2.5 rounded-md text-sm font-semibold border transition cursor-pointer ${
          active
            ? "border-accent bg-accent/5 text-accent"
            : "border-border bg-bg-secondary text-text-secondary hover:text-text-primary hover:border-text-secondary"
        }`}
      >
        <motion.div
          animate={{ scale: active ? [1, 1.25, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`w-4 h-4 ${
              active ? "fill-accent stroke-accent" : "stroke-current"
            }`}
          />
        </motion.div>
        <span>{active ? "Saved" : "Save Property"}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white cursor-pointer ${
        active ? "text-accent" : "text-text-secondary"
      }`}
    >
      <motion.div
        animate={{ scale: active ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-5 h-5 ${
            active ? "fill-accent stroke-accent" : "stroke-current"
          }`}
        />
      </motion.div>
    </motion.button>
  );
}
