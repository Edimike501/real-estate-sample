import CTA from "@/components/sections/CTA";
import Hero from "@/components/sections/Hero";
import Packages from "@/components/sections/Packages";
import Process from "@/components/sections/Process";
import PropertiesSection from "@/components/sections/Properties";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import WhyUs from "@/components/sections/WhyUs";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteMetadata } from "@/metadata/site";

export default function HomePage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.opolloluxuries.com";

  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteMetadata.company.name,
    description: siteMetadata.company.description,
    url: baseUrl,
    logo: `${baseUrl}${siteMetadata.company.logo}`,
    image: `${baseUrl}/og-image.jpg`,
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
    areaServed: [
      { "@type": "Country", name: "Nigeria" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United Arab Emirates" }
    ],
    priceRange: "$$$$"
    // sameAs: [
    //   siteMetadata.contact.instagram,
    //   siteMetadata.contact.facebook,
    //   siteMetadata.contact.linkedin
    // ]
  };

  return (
    <>
      <JsonLd schema={homepageSchema} />
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
