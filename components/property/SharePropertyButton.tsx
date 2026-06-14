"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SharePropertyButtonProps {
  propertyTitle: string;
  propertyUrl: string;
}

export default function SharePropertyButton({
  propertyTitle,
  propertyUrl,
}: SharePropertyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          url: propertyUrl,
        });
      } catch (err) {
        console.error("Error sharing property:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(propertyUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 justify-center px-4 py-2.5 rounded-md text-sm font-semibold border border-border bg-bg-secondary text-text-secondary hover:text-text-primary hover:border-text-secondary transition cursor-pointer w-full md:w-auto"
      >
        <Share2 className="w-4 h-4" />
        <span>Share Property</span>
      </button>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-10 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-text-primary text-bg-primary px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shadow-md pointer-events-none"
          >
            Link copied!
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
