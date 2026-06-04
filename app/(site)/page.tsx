import CTA from "@/components/sections/CTA";
import Hero from "@/components/sections/Hero";
import Packages from "@/components/sections/Packages";
import Process from "@/components/sections/Process";
import PropertiesSection from "@/components/sections/Properties";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import WhyUs from "@/components/sections/WhyUs";

export default function HomePage() {
  return (
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
  );
}
