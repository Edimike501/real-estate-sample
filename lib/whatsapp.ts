import { InquirySource } from "@/types/enums";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

type BuildWhatsAppLinkParams = {
  guestName: string;
  guestPhone: string;
  propertyTitle?: string;
  propertyLocation?: string;
  propertyUrl?: string;        // ← ADD: full public URL to the property page
  source: InquirySource;
  customMessage?: string;
};

export function buildWhatsAppLink(params: BuildWhatsAppLinkParams): string {
  const encoded = encodeURIComponent(buildWhatsAppMessage(params));
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encoded}`;
}

export function buildWhatsAppMessage(params: BuildWhatsAppLinkParams): string {
  const { guestName, propertyTitle, propertyLocation, propertyUrl, customMessage } = params;
  if (customMessage) return customMessage;

  if (propertyTitle) {
    return (
      `Hi Opollo Luxury Properties, my name is ${guestName}.\n\n` +
      `I'm interested in the following property:\n` +
      `*${propertyTitle}*` +
      (propertyLocation ? `\n📍 ${propertyLocation}` : "") +
      (propertyUrl ? `\n🔗 ${propertyUrl}` : "") +
      `\n\nPlease get back to me. Thank you.`
    );
  }
  return (
    `Hi Opollo Luxury Properties, my name is ${guestName}.\n\n` +
    `I'd like to make a general enquiry about your properties.`
  );
}
