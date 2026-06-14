"use client";

import { useEffect, useState, useRef } from "react";
import BookmarkButton from "./BookmarkButton";
import SharePropertyButton from "./SharePropertyButton";
import { useGuestSession } from "@/hooks/useGuestSession";
import { InquirySource } from "@/types/enums";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface PropertyClientActionsProps {
  propertyId: string;
  propertyTitle: string;
  propertySlug: string;
  propertyLocation: string;
}

export default function PropertyClientActions({
  propertyId,
  propertyTitle,
  propertySlug,
  propertyLocation,
}: PropertyClientActionsProps) {
  const { session } = useGuestSession();
  const [showSticky, setShowSticky] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/properties/${propertySlug}`;

  // Observe the main form's submit button to hide/show sticky bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide sticky bar when the main button is visible
        setShowSticky(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById("main-enquiry-button");
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  const handleEnquiry = async () => {
    setIsSubmitting(true);
    try {
      const guestName = session?.name || "Guest";
      const guestPhone = session?.phone || "";
      const guestEmail = session?.email || "";

      // Post inquiry to backend to record the lead
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          guestPhone: guestPhone || "0000000000",
          guestEmail: guestEmail || undefined,
          propertyId,
          source: InquirySource.PROPERTY_PAGE,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      } else {
        // Fallback directly to WhatsApp build if API fails
        const fallbackUrl = buildWhatsAppLink({
          guestName,
          guestPhone,
          propertyTitle,
          propertyLocation,
          propertyUrl,
          source: InquirySource.PROPERTY_PAGE,
        });
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Error submitting sticky WhatsApp inquiry:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Detail Page Action Row (Bookmark + Share) */}
      <div className="flex flex-wrap gap-3 items-center py-2 border-b border-border mb-4">
        <BookmarkButton propertyId={propertyId} variant="button" />
        <SharePropertyButton propertyTitle={propertyTitle} propertyUrl={propertyUrl} />
      </div>

      {/* Sticky Bottom Bar (Mobile Only) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border px-4 py-3 md:hidden shadow-lg transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-text-primary truncate font-display tracking-wide uppercase">
            {propertyTitle}
          </span>
          <button
            onClick={handleEnquiry}
            disabled={isSubmitting}
            className="w-full text-center py-2.5 px-4 bg-accent hover:bg-accent-light text-white font-semibold text-xs rounded-md shadow-sm transition cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? "Opening WhatsApp..." : "Enquire on WhatsApp"}
          </button>
        </div>
      </div>
    </>
  );
}
