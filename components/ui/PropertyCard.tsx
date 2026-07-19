"use client";

import { useGuestSession } from "@/hooks/useGuestSession";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Property } from "@/types";
import { InquirySource } from "@/types/enums";
import { Bath, Bed, MessageCircle, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "./AnimatedSection";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { session } = useGuestSession();
  const imageSrc = property.image ?? "/images/properties/prop-001.svg";
  const statusColors = {
    AVAILABLE: "bg-green-500",
    SOLD: "bg-red-500",
    LET: "bg-red-500",
    UNDER_OFFER: "bg-amber-500",
    COMING_SOON: "bg-slate-500",
    Available: "bg-green-500",
    Sold: "bg-red-500",
    "Under Offer": "bg-amber-500"
  };

  const typeColors = {
    SALE: "bg-blue-100 text-blue-700",
    RENTAL: "bg-orange-100 text-orange-700",
    LAND: "bg-green-100 text-green-700",
    DEVELOPMENT: "bg-purple-100 text-purple-700",
    Land: "bg-blue-100 text-blue-700",
    House: "bg-purple-100 text-purple-700",
    Commercial: "bg-slate-100 text-slate-700",
    Apartment: "bg-orange-100 text-orange-700"
  };
  const statusKey = String(property.status) as keyof typeof statusColors;
  const typeKey = String(
    property.type ?? property.listingType
  ) as keyof typeof typeColors;

  const propertyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/properties/${property.slug}`;
  const locationStr =
    property.location ||
    [property.city, property.lga, property.state].filter(Boolean).join(", ");

  const whatsappLink = buildWhatsAppLink({
    guestName: session?.name || "Guest",
    guestPhone: session?.phone || "",
    propertyTitle: property.title,
    propertyLocation: locationStr,
    propertyUrl,
    source: InquirySource.FEATURED_CARD
  });

  return (
    <AnimatedSection>
      <div className="bg-bg-secondary rounded-lg overflow-hidden border border-border hover:border-border-accent transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-bg-tertiary">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            unoptimized={imageSrc.endsWith(".svg")}
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${statusColors[statusKey]}`}>
              {String(property.status)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${typeColors[typeKey]}`}>
              {String(property.type ?? property.listingType)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-display font-bold text-text-primary mb-1">
              {property.title}
            </h3>
            <p className="text-text-muted text-sm">{property.location || locationStr}</p>
          </div>

          <p className="text-2xl font-bold text-accent">{property.price}</p>

          <p className="text-text-secondary text-sm line-clamp-2">
            {property.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-4 py-4 border-y border-border">
            {property.bedrooms && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Ruler className="w-4 h-4" />
              <span>{property.size}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2">
            <Link
              href={`/properties/${property.slug}`}
              className="inline-flex w-full items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-light transition">
              View Property
            </Link>
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                fetch("/api/inquiries", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    guestName: session?.name || "Guest",
                    guestPhone: session?.phone || "0000000000",
                    guestEmail: session?.email || undefined,
                    propertyId: property.id,
                    source: InquirySource.FEATURED_CARD,
                  }),
                }).catch((err) => {
                  console.error("Error submitting property card inquiry:", err);
                });
              }}
              className="inline-flex w-full items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all px-6 py-3 text-sm">
              <MessageCircle className="w-5 h-5" />
              Enquire Now
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
