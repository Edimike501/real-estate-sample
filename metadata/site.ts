import type { SiteConfig } from "@/types";

export const siteMetadata: SiteConfig = {
  // Brand
  company: {
    name: "Opollo Luxury Properties",
    tagline: "Premium Luxury Real Estate for Nigeria & Diaspora",
    description:
      "Premium real estate development, sales & consultancy in Lagos. Expert property investment and transparent legal solutions for local and diaspora buyers.",
    founded: "2020",
    logo: "/images/opollo-luxury.png",
    owner: "Taylor Atu Goodnews"
  },

  // Contact
  contact: {
    whatsapp: "+2347049785717",
    whatsappMessage:
      "Hi, I found your website and I'm interested in your properties.",
    email: "opolloluxuries@gmail.com",
    phone: "+2347049785717",
    address:
      "A2 59/60, Agric Building Materials Complex, Abule Ado Junction, Lagos, Nigeria",
    instagram: "https://instagram.com/opolloluxury",
    facebook: "https://facebook.com/opolloluxury",
    linkedin: "https://linkedin.com/company/opollo-luxury-properties"
  },

  // Hero section
  hero: {
    headline: "Find Your Perfect",
    headlineAccent: "Property in Nigeria",
    subtext:
      "Premium real estate development, sales and consultancy — for local buyers and the Nigerian Diaspora.",
    ctaPrimary: { label: "View Properties", href: "/properties" },
    ctaSecondary: { label: "Talk to Us", href: "/contact" },
    stats: [
      { value: "200+", label: "Properties Sold" },
      { value: "12+", label: "Years Experience" },
      { value: "500+", label: "Happy Clients" }
    ]
  },

  // Services section
  services: {
    heading: "What We Offer",
    subtext:
      "End-to-end real estate solutions for buyers, investors and the Diaspora community.",
    items: [
      {
        icon: "Building2",
        title: "Real Estate Development",
        description:
          "We develop premium residential and commercial properties across Lagos and beyond."
      },
      {
        icon: "Handshake",
        title: "Property Sales",
        description:
          "Buy land, houses and commercial spaces with full legal guidance and transparent pricing."
      },
      {
        icon: "Briefcase",
        title: "Consultancy",
        description:
          "Expert advice for local buyers and Diaspora investors looking to build wealth in Nigeria."
      },
      {
        icon: "Globe",
        title: "Diaspora Services",
        description:
          "We handle the full process remotely so you can invest from anywhere in the world."
      }
    ]
  },

  // Packages section
  packages: {
    heading: "Our Packages",
    subtext:
      "Transparent pricing with no hidden fees. Start where you are and scale as you grow.",
    items: [
      {
        name: "Starter",
        phase: "Entry Level",
        price: "₦5,000,000",
        priceNote: "starting from",
        featured: false,
        features: [
          "Land acquisition support",
          "Title verification",
          "Legal documentation",
          "Site inspection"
        ],
        cta: "Enquire Now"
      },
      {
        name: "Standard",
        phase: "Most Popular",
        price: "₦15,000,000",
        priceNote: "starting from",
        featured: true,
        features: [
          "Everything in Starter",
          "Full property development",
          "Architectural drawings",
          "Project management",
          "Post-sale support"
        ],
        cta: "Get Started"
      },
      {
        name: "Premium",
        phase: "Full Service",
        price: "Custom",
        priceNote: "contact for quote",
        featured: false,
        features: [
          "Everything in Standard",
          "Diaspora investment advisory",
          "Portfolio management",
          "International wire support",
          "Dedicated account manager"
        ],
        cta: "Talk to Us"
      }
    ]
  },

  // Why us section
  whyUs: {
    heading: "Why Choose Us",
    subtext:
      "We understand the Nigerian real estate market from both sides — local and Diaspora.",
    points: [
      {
        number: "01",
        title: "Trusted & Transparent",
        body: "Every transaction comes with full documentation, verified titles, and no hidden fees."
      },
      {
        number: "02",
        title: "Diaspora-Ready",
        body: "We handle the entire purchase process remotely so you can invest from the UK, USA, Canada or UAE."
      },
      {
        number: "03",
        title: "End-to-End Support",
        body: "From site search to title documentation — we walk with you through every step."
      }
    ]
  },

  // Process section
  process: {
    heading: "How It Works",
    subtext:
      "Simple, clear steps from first conversation to handing over the keys.",
    steps: [
      {
        number: "01",
        title: "Initial Consultation",
        body: "Tell us what you need. We listen, advise and match you with the right opportunity."
      },
      {
        number: "02",
        title: "Property Selection",
        body: "We shortlist verified properties that match your budget, location and goals."
      },
      {
        number: "03",
        title: "Legal & Documentation",
        body: "Our legal team handles all title checks, agreements and regulatory compliance."
      },
      {
        number: "04",
        title: "Handover",
        body: "Once payment is complete, we hand over all keys, documents and post-sale support."
      }
    ]
  },

  // Testimonials
  testimonials: {
    heading: "What Our Clients Say",
    items: [
      {
        name: "Adaeze O.",
        location: "London, UK",
        text: "I bought my first property in Lagos from the UK without visiting once. The team handled everything professionally.",
        rating: 5
      },
      {
        name: "Chukwuemeka B.",
        location: "Lagos, Nigeria",
        text: "Very transparent process. No hidden charges, they kept me updated at every stage.",
        rating: 5
      },
      {
        name: "Funmilayo A.",
        location: "Houston, USA",
        text: "Finally a real estate company I can trust. The consultancy team really knows their stuff.",
        rating: 5
      }
    ]
  },

  // CTA section
  cta: {
    heading: "Ready to Find Your Property?",
    subtext:
      "Talk to us today — whether you're in Nigeria or abroad. One conversation is all it takes.",
    buttonLabel: "Chat on WhatsApp"
  },

  // Footer
  footer: {
    tagline: "Premium luxury real estate for Nigeria and the Diaspora.",
    copyright: `© ${new Date().getFullYear()} Opollo Luxury Properties Ltd. All rights reserved.`
  }
};
