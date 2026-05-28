/* Site Configuration */
export interface SiteConfig {
  company: {
    name: string;
    tagline: string;
    description: string;
    founded: string;
    logo: string;
    owner?: string;
  };
  contact: {
    whatsapp: string;
    whatsappMessage: string;
    email: string;
    phone: string;
    address: string;
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  hero: {
    headline: string;
    headlineAccent: string;
    subtext: string;
    ctaPrimary: CTA;
    ctaSecondary: CTA;
    stats: Stat[];
  };
  services: {
    heading: string;
    subtext: string;
    items: Service[];
  };
  packages: {
    heading: string;
    subtext: string;
    items: Package[];
  };
  whyUs: {
    heading: string;
    subtext: string;
    points: Point[];
  };
  process: {
    heading: string;
    subtext: string;
    steps: ProcessStep[];
  };
  testimonials: {
    heading: string;
    items: Testimonial[];
  };
  cta: {
    heading: string;
    subtext: string;
    buttonLabel: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
}

export interface CTA {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Package {
  name: string;
  phase: string;
  price: string;
  priceNote: string;
  featured: boolean;
  features: string[];
  cta: string;
}

export interface Point {
  number: string;
  title: string;
  body: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}

/* Property Listing */
export type PropertyType = "Land" | "House" | "Commercial" | "Apartment";
export type PropertyStatus = "Available" | "Sold" | "Under Offer";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  size: string;
  image: string;
  featured: boolean;
  description: string;
  whatsappMessage: string;
}
