"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { siteMetadata } from "@/metadata/site";
import Link from "next/link";

export default function Hero() {
  const hero = siteMetadata.hero;
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-bg-primary section-padding overflow-hidden">
      {/* Decorative radial gradient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-accent opacity-5 blur-3xl" />
      </div>
      <AnimatedSection
        delay={0.1}
        className="relative z-10 w-full max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
          {hero.headline}
          <br />
          <span className="text-accent">{hero.headlineAccent}</span>
        </h1>
        <p className="text-lg md:text-2xl text-text-secondary max-w-2xl mx-auto">
          {hero.subtext}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link
            href={hero.ctaPrimary.href}
            className="px-8 py-3 rounded-lg bg-accent text-white font-semibold text-lg shadow-md hover:bg-accent-light transition-all">
            {hero.ctaPrimary.label}
          </Link>
          <Link
            href={hero.ctaSecondary.href}
            className="px-8 py-3 rounded-lg border border-accent text-accent font-semibold text-lg hover:bg-accent hover:text-white transition-all">
            {hero.ctaSecondary.label}
          </Link>
        </div>
        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          {hero.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-accent">
                {stat.value}
              </span>
              <span className="text-text-secondary text-sm md:text-base mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
