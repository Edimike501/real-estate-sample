import AnimatedSection from "@/components/ui/AnimatedSection";
import { siteMetadata } from "@/metadata/site";
import {
  Briefcase,
  Building2,
  Globe,
  Handshake,
  LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Handshake,
  Briefcase,
  Globe
};

export default function Services() {
  const services = siteMetadata.services;
  return (
    <section id="services" className="section-padding bg-bg-secondary">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-2">
            {services.heading}
          </h2>
          <p className="text-lg text-text-secondary">{services.subtext}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {services.items.map((item) => {
            const Icon = iconMap[item.icon] || Building2;
            return (
              <div
                key={item.title}
                className="bg-bg-primary rounded-xl border border-border hover:border-accent transition-colors p-8 flex flex-col items-center text-center shadow-sm">
                <Icon className="w-10 h-10 mb-4 text-accent" />
                <h3 className="text-xl font-bold font-display mb-2 text-text-primary">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-base">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </AnimatedSection>
    </section>
  );
}
