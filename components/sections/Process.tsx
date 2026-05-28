import AnimatedSection from "@/components/ui/AnimatedSection";
import { siteMetadata } from "@/metadata/site";

export default function Process() {
  const process = siteMetadata.process;
  return (
    <section className="section-padding bg-bg-secondary" id="process">
      <AnimatedSection>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-8 text-center">
            {process.heading}
          </h2>
          <p className="text-lg text-text-secondary mb-12 text-center">
            {process.subtext}
          </p>
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            {process.steps.map((step, i) => (
              <div
                key={step.number}
                className="flex-1 flex flex-col items-center md:items-start text-center md:text-left relative">
                <span className="text-5xl font-bold text-accent/20 select-none leading-none mb-2">
                  {step.number}
                </span>
                <h4 className="text-xl font-bold font-display text-text-primary mb-1">
                  {step.title}
                </h4>
                <p className="text-text-secondary text-base mb-4">
                  {step.body}
                </p>
                {i < process.steps.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 w-12 h-1 bg-accent/10 -translate-y-1/2" />
                )}
                {i < process.steps.length - 1 && (
                  <div className="md:hidden w-1 h-8 bg-accent/10 mx-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
