import CTA from "@/components/sections/CTA";
import Hero from "@/components/sections/Hero";
import Packages from "@/components/sections/Packages";
import Process from "@/components/sections/Process";
import PropertiesSection from "@/components/sections/Properties";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import WhyUs from "@/components/sections/WhyUs";
import { siteMetadata } from "@/metadata/site";

export default function HomePage() {
  // Construct Schema.org structure dynamically from your configurations
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteMetadata.company.name,
    description: siteMetadata.company.description,
    url: "https://www.opolloluxuries.com",
    logo: `https://www.opolloluxuries.com${siteMetadata.company.logo}`,
    image: "https://www.opolloluxuries.com/og-image.jpg",
    telephone: siteMetadata.contact.phone,
    email: siteMetadata.contact.email,
    foundingDate: siteMetadata.company.founded,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteMetadata.contact.address,
      addressLocality: "Lagos",
      addressCountry: "NG"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "6.4594",
      longitude: "3.2292"
    },
    // sameAs: [
    //   siteMetadata.contact.instagram,
    //   siteMetadata.contact.facebook,
    //   siteMetadata.contact.linkedin
    // ],
    priceRange: "₦5,000,000 - ₦15,000,000+",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: siteMetadata.testimonials.items.length.toString()
    },
    review: siteMetadata.testimonials.items.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name
      },
      reviewBody: t.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating.toString()
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero />
        <Services />
        <PropertiesSection />
        <WhyUs />
        <Packages />
        <Process />
        <Testimonials />
        <CTA />
      </main>
    </>
  );
}
