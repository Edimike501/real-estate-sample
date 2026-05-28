import AnimatedSection from "@/components/ui/AnimatedSection";
import { siteMetadata } from "@/metadata/site";

export default function Testimonials() {
  const testimonials = siteMetadata.testimonials;
  return (
    <section className="section-padding bg-bg-primary" id="testimonials">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-2">
            {testimonials.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.items.map((item) => (
            <div
              key={item.name}
              className="bg-bg-secondary rounded-xl border border-border p-8 flex flex-col items-center text-center shadow-sm">
              <div className="flex gap-1 mb-2">
                {[...Array(item.rating)].map((_, i) => (
                  <span key={i} className="text-accent text-xl">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-lg text-text-secondary mb-4">“{item.text}”</p>
              <div className="font-semibold text-text-primary">{item.name}</div>
              <div className="text-sm text-text-muted">{item.location}</div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
