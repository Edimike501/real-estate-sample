import AnimatedSection from "@/components/ui/AnimatedSection";
import { siteMetadata } from "@/metadata/site";

export default function WhyUs() {
  const why = siteMetadata.whyUs;
  return (
    <section className="section-padding bg-bg-secondary" id="whyus">
      <AnimatedSection>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
              {why.heading}
            </h2>
            <p className="text-lg text-text-secondary mb-8">{why.subtext}</p>
          </div>
          <div className="space-y-6">
            {why.points.map((point) => (
              <div
                key={point.number}
                className="flex gap-6 items-start bg-bg-primary rounded-lg border border-border p-6">
                <span className="text-5xl font-bold text-accent/20 select-none leading-none">
                  {point.number}
                </span>
                <div>
                  <h4 className="text-xl font-bold font-display text-text-primary mb-1">
                    {point.title}
                  </h4>
                  <p className="text-text-secondary text-base">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
