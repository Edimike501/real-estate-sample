import { JsonLd } from "@/components/seo/JsonLd";
import ContactForm from "@/components/ui/ContactForm";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteMetadata } from "@/metadata/site";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  // becomes → "Contact Us | Opollo Luxury Properties" via the template in layout.tsx

  description:
    "Get in touch with Opollo Luxury Properties Ltd. Whether you're in Nigeria or abroad, our team is ready to help you find, buy, or rent your ideal property. Reach us via WhatsApp, email or visit our Lagos office.",

  keywords: [
    "contact Opollo Luxury Properties",
    "real estate agent Lagos contact",
    "buy property Nigeria contact",
    "Nigerian Diaspora property enquiry",
    "Lagos real estate consultation",
    "property investment enquiry Nigeria",
    "Opollo Properties WhatsApp",
    "Abule Ado real estate office"
  ],

  openGraph: {
    title: "Contact Opollo Luxury Properties",
    description:
      "Reach out to our team for property enquiries, consultations, and investment advice. We serve buyers in Nigeria and the Diaspora — available via WhatsApp, email and in person in Lagos.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
    siteName: siteMetadata.company.name,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Opollo Luxury Properties — Lagos, Nigeria"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Opollo Luxury Properties",
    description:
      "Property enquiries, investment consultations, and more. Reach our Lagos team via WhatsApp or email — we serve Nigeria and the Diaspora.",
    images: ["/og-image.jpg"]
  },

  // Structured data hint for Google — your business address and contact
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/contact`
  }
};

export default function ContactPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.opolloluxuries.com";

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${baseUrl}/contact`,
    name: "Contact Opollo Luxury Properties",
    mainEntity: {
      "@type": "LocalBusiness",
      name: siteMetadata.company.name,
      telephone: siteMetadata.contact.phone,
      email: siteMetadata.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "A2 59/60, Agric Building Materials Complex, Abule Ado Junction",
        addressLocality: "Lagos",
        addressCountry: "NG"
      }
    }
  };
  const { contact } = siteMetadata;

  return (
    <>
      <JsonLd schema={contactPageSchema} />
      <main className="section-padding bg-bg-primary min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-text-secondary">
              Tell us what you want to buy, develop, or invest in. We will help
              you choose the right next step.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
            <aside className="bg-bg-secondary border border-border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
                  Opollo Luxury Properties
                </h2>
                <p className="text-text-secondary">
                  Premium real estate development, sales, and consultancy for
                  local buyers and Nigerians in the Diaspora.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href={`tel:${contact.phone}`}
                  className="flex items-start gap-3 text-text-secondary hover:text-accent transition-colors">
                  <Phone className="h-5 w-5 mt-1 text-accent" />
                  <span>{contact.phone}</span>
                </Link>
                <Link
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-3 text-text-secondary hover:text-accent transition-colors">
                  <Mail className="h-5 w-5 mt-1 text-accent" />
                  <span>{contact.email}</span>
                </Link>
                <div className="flex items-start gap-3 text-text-secondary">
                  <MapPin className="h-5 w-5 mt-1 text-accent" />
                  <span>{contact.address}</span>
                </div>
              </div>

              <WhatsAppButton
                phoneNumber={contact.whatsapp}
                message={contact.whatsappMessage}
                label="Chat on WhatsApp"
                className="w-full"
              />
            </aside>

            <ContactForm />
          </div>
        </div>
      </main>
    </>
  );
}
