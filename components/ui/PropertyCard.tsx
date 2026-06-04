"use client";

import { Property } from "@/types";
import { Bath, Bed, Ruler } from "lucide-react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import WhatsAppButton from "./WhatsAppButton";

interface PropertyCardProps {
  property: Property;
  phoneNumber: string;
}

export default function PropertyCard({
  property,
  phoneNumber
}: PropertyCardProps) {
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
  const typeKey = String(property.type ?? property.listingType) as keyof typeof typeColors;

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
            <p className="text-text-muted text-sm">{property.location}</p>
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
          <WhatsAppButton
            phoneNumber={phoneNumber}
            message={property.whatsappMessage ?? `Hi, I'm interested in ${property.title}.`}
            label="Enquire Now"
            className="w-full"
          />
        </div>
      </div>
    </AnimatedSection>
  );
}
