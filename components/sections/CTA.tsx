import AnimatedSection from "@/components/ui/AnimatedSection";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteMetadata } from "@/metadata/site";

export default function CTA() {
  const cta = siteMetadata.cta;
  const phone = siteMetadata.contact.whatsapp;
  const message = siteMetadata.contact.whatsappMessage;
  return (
    <section className="section-padding bg-accent text-white" id="cta">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
            {cta.heading}
          </h2>
          <p className="text-lg md:text-xl mb-6">{cta.subtext}</p>
          <WhatsAppButton
            phoneNumber={phone}
            message={message}
            label={cta.buttonLabel}
            variant="inline"
            className="min-w-56 bg-white text-accent! hover:bg-accent-light hover:text-white! font-bold [&_svg]:text-current"
          />
        </div>
      </AnimatedSection>
    </section>
  );
}
