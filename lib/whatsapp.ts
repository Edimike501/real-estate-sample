import { InquirySource } from "@/types/enums";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

type BuildWhatsAppLinkParams = {
  guestName: string;
  guestPhone: string;
  propertyTitle?: string;
  propertyLocation?: string;
  source: InquirySource;
  customMessage?: string;
};

export function buildWhatsAppLink(params: BuildWhatsAppLinkParams): string {
  const encoded = encodeURIComponent(buildWhatsAppMessage(params));
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encoded}`;
}

export function buildWhatsAppMessage(params: BuildWhatsAppLinkParams): string {
  const { guestName, propertyTitle, propertyLocation, customMessage } = params;
  if (customMessage) return customMessage;

  if (propertyTitle) {
    return (
      `Hi Opollo Luxury Properties, my name is ${guestName}. ` +
      `I'm interested in the property: *${propertyTitle}*` +
      (propertyLocation ? ` located at ${propertyLocation}` : "") +
      `. Please get back to me. Thank you.`
    );
  }

  return (
    `Hi Opollo Luxury Properties, my name is ${guestName}. ` +
    `I'd like to make a general enquiry about your properties.`
  );
}
