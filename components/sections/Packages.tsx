import AnimatedSection from "@/components/ui/AnimatedSection";
import { siteMetadata } from "@/metadata/site";

export default function Packages() {
  const packages = siteMetadata.packages;
  return (
    <section className="section-padding bg-bg-primary" id="packages">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-2">
            {packages.heading}
          </h2>
          <p className="text-lg text-text-secondary">{packages.subtext}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.items.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative bg-bg-secondary rounded-xl border border-border p-8 flex flex-col items-center text-center shadow-sm ${pkg.featured ? "border-accent ring-2 ring-accent" : ""}`}>
              {pkg.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold shadow">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold font-display mb-2 text-text-primary">
                {pkg.name}
              </h3>
              <div className="text-accent text-4xl font-bold mb-1">
                {pkg.price}
              </div>
              <div className="text-xs text-text-muted mb-4">
                {pkg.priceNote}
              </div>
              <ul className="text-left space-y-2 mb-6">
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-text-secondary">
                    <span className="inline-block w-2 h-2 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/contact"
                className="inline-block px-6 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent-light transition-all">
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
