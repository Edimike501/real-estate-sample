"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useGuestSession } from "@/hooks/useGuestSession";
import { useSubmitInquiry } from "@/hooks/useInquiries";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { InquirySource } from "@/types/enums";

import BookmarkButton from "./BookmarkButton";
import SharePropertyButton from "./SharePropertyButton";

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
  propertyLocation
}: PropertyClientActionsProps) {
  const { session } = useGuestSession();
  const [showSticky, setShowSticky] = useState(false);
  const submitInquiryMutation = useSubmitInquiry();

  const propertyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/properties/${propertySlug}`;

  // Observe the main form's submit button to hide/show sticky bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
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

  const handleEnquiry = () => {
    const guestName = session?.name || "Guest";
    const guestPhone = session?.phone || "";
    const guestEmail = session?.email || "";

    submitInquiryMutation.mutate(
      {
        guestName,
        guestPhone: guestPhone || "0000000000",
        guestEmail: guestEmail || undefined,
        propertyId,
        source: InquirySource.PROPERTY_PAGE
      },
      {
        onSuccess: (data) => {
          toast.success("Inquiry submitted! Redirecting to WhatsApp...");
          if (data?.whatsappUrl) {
            window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
          }
        },
        onError: () => {
          const fallbackUrl = buildWhatsAppLink({
            guestName,
            guestPhone,
            propertyTitle,
            propertyLocation,
            propertyUrl,
            source: InquirySource.PROPERTY_PAGE
          });
          toast.success("Inquiry submitted! Redirecting to WhatsApp...");
          window.open(fallbackUrl, "_blank", "noopener,noreferrer");
        }
      }
    );
  };

  return (
    <>
      {/* Detail Page Action Row (Bookmark + Share) */}
      <div className="flex flex-wrap gap-3 items-center py-2 border-b border-border mb-4">
        <BookmarkButton propertyId={propertyId} variant="button" />
        <SharePropertyButton
          propertyTitle={propertyTitle}
          propertyUrl={propertyUrl}
        />
      </div>

      {/* Sticky Bottom Bar (Mobile Only) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border px-4 py-3 md:hidden shadow-lg transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-text-primary truncate font-display tracking-wide uppercase">
            {propertyTitle}
          </span>
          <button
            onClick={handleEnquiry}
            disabled={submitInquiryMutation.isPending}
            className="w-full text-center py-2.5 px-4 bg-accent hover:bg-accent-light text-white font-semibold text-xs rounded-md shadow-sm transition cursor-pointer disabled:opacity-75">
            {submitInquiryMutation.isPending ? "Opening WhatsApp..." : "Enquire on WhatsApp"}
          </button>
        </div>
      </div>
    </>
  );
}
