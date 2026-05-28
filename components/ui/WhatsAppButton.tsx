import { cn, generateWhatsAppUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

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

  if (variant === "floating") {
    return (
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
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
        className={cn(
          "inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all",
          className
        )}>
      <MessageCircle className="w-5 h-5" />
      {label}
    </Link>
  );
}
