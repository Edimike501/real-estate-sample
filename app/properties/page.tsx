import AnimatedSection from "@/components/ui/AnimatedSection";
import PropertyCard from "@/components/ui/PropertyCard";
import { properties } from "@/metadata/properties";
import { siteMetadata } from "@/metadata/site";

export default function PropertiesPage() {
  const phone = siteMetadata.contact.whatsapp;
  return (
    <section className="section-padding bg-bg-primary min-h-screen">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-2">
            All Properties
          </h1>
          <p className="text-lg text-text-secondary">
            Browse all available listings
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              phoneNumber={phone}
            />
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
