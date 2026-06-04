import ContactForm from "@/components/ui/ContactForm";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteMetadata } from "@/metadata/site";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Opollo Luxury Properties for property enquiries.",
};

export default function ContactPage() {
  const { contact } = siteMetadata;

  return (
    <main className="section-padding bg-bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">Contact Us</h1>
          <p className="text-lg text-text-secondary">
            Tell us what you want to buy, develop, or invest in. We will help you choose the right next step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <aside className="bg-bg-secondary border border-border rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Opollo Luxury Properties</h2>
              <p className="text-text-secondary">
                Premium real estate development, sales, and consultancy for local buyers and Nigerians in the
                Diaspora.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href={`tel:${contact.phone}`}
                className="flex items-start gap-3 text-text-secondary hover:text-accent transition-colors"
              >
                <Phone className="h-5 w-5 mt-1 text-accent" />
                <span>{contact.phone}</span>
              </Link>
              <Link
                href={`mailto:${contact.email}`}
                className="flex items-start gap-3 text-text-secondary hover:text-accent transition-colors"
              >
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
  );
}
