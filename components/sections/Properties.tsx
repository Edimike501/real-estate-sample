"use client";

import { PropertyCard } from "@/components/property/PropertyCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useDiasporaLocation } from "@/hooks/useDiasporaLocation";
import { useProperties } from "@/hooks/useProperties";
import { siteMetadata } from "@/metadata/site";
import Link from "next/link";

export default function PropertiesSection() {
  const { currency } = useDiasporaLocation();
  const { data, isLoading, error } = useProperties(
    {
      featured: true,
      limit: 3
    },
    currency || "USD"
  );
  const phone = siteMetadata.contact.whatsapp;

  if (isLoading) {
    return (
      <section className="section-padding bg-bg-primary" id="properties">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-2">
              Featured Properties
            </h2>
            <p className="text-lg text-text-secondary">
              Handpicked listings for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-bg-secondary rounded-lg animate-pulse"
              />
            ))}
          </div>
        </AnimatedSection>
      </section>
    );
  }

  if (error || !data?.properties) {
    return (
      <section className="section-padding bg-bg-primary" id="properties">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-2">
              Featured Properties
            </h2>
            <p className="text-lg text-text-secondary">
              Unable to load properties at this time.
            </p>
          </div>
        </AnimatedSection>
      </section>
    );
  }

  const featured = data.properties;

  return (
    <section className="section-padding bg-bg-primary" id="properties">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-2">
            Featured Properties
          </h2>
          <p className="text-lg text-text-secondary">
            Handpicked listings for you
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} priority />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/properties"
            className="inline-block px-8 py-3 rounded-lg border border-accent text-accent font-semibold hover:bg-accent hover:text-white transition-all">
            View all properties
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
}
