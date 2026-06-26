"use client";

import { cn, generateWhatsAppUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useGuestSession } from "@/hooks/useGuestSession";
import { InquirySource } from "@/types/enums";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message: string;
  variant?: "floating" | "inline";
  label?: string;
  className?: string;
}

export default function WhatsAppButton({
  phoneNumber,
  message,
  variant = "inline",
  label = "Chat on WhatsApp",
  className = ""
}: WhatsAppButtonProps) {
  const whatsappUrl = generateWhatsAppUrl(phoneNumber, message);
  const { session } = useGuestSession();

  const handleClick = () => {
    const source = variant === "floating" ? InquirySource.WHATSAPP_FLOAT : InquirySource.CONTACT_FORM;
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: session?.name || "Guest",
        guestPhone: session?.phone || "0000000000",
        guestEmail: session?.email || undefined,
        source,
        message: message || undefined,
      }),
    }).catch((err) => {
      console.error("Error submitting WhatsApp inquiry:", err);
    });
  };

  if (variant === "floating") {
    return (
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Chat on WhatsApp">
        <MessageCircle className="w-7 h-7 text-white" />
      </Link>
    );
  }

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all",
        className
      )}>
      <MessageCircle className="w-5 h-5" />
      {label}
    </Link>
  );
}

