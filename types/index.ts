import {
  InquirySource,
  InquiryStatus,
  ListingType,
  MediaType,
  NegotiationStatus,
  PriceFrequency,
  PropertyStatus,
  UserRole,
} from "@/types/enums";

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

/* Phase 2 Domain Models */

export interface PropertyMedia {
  id: string;
  propertyId: string;
  url: string;
  thumbnailUrl?: string | null;
  publicId: string;
  mediaType: MediaType | `${MediaType}`;
  altText?: string | null;
  order: number;
  createdAt: string | Date;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  listingType: ListingType | `${ListingType}`;
  status: PropertyStatus | `${PropertyStatus}` | "Available" | "Sold" | "Under Offer";
  negotiationStatus: NegotiationStatus | `${NegotiationStatus}`;
  isFeatured: boolean;
  isPinned: boolean;
  address?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  toilets?: number | null;
  sizeSqm?: number | null;
  salePrice?: number | null;
  rentalPrice?: number | null;
  priceFrequency?: PriceFrequency | `${PriceFrequency}` | null;
  availableFrom?: string | Date | null;
  leaseTerm?: string | null;
  serviceCharge?: number | null;
  cautionFee?: number | null;
  landSizeSqm?: number | null;
  titleType?: string | null;
  virtualTourUrl?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
  media?: PropertyMedia[];
  inquiries?: Inquiry[];
  // Legacy UI compatibility fields (to be removed after full page migration)
  location?: string;
  price?: string;
  type?: string;
  size?: string;
  image?: string;
  featured?: boolean;
  whatsappMessage?: string;
}

export interface Inquiry {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string | null;
  propertyId?: string | null;
  source: InquirySource | `${InquirySource}`;
  message?: string | null;
  whatsappNumber: string;
  whatsappMessage: string;
  status: InquiryStatus | `${InquiryStatus}`;
  adminNotes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  property?: Property | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | `${UserRole}`;
  isActive: boolean;
  createdBy?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PropertyFilters {
  listingType?: ListingType;
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  status?: PropertyStatus;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export type PropertiesResponse = {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
};

export type InquiryCreateRequest = {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  propertyId?: string;
  source: InquirySource;
  message?: string;
};

export type InquiryCreateResponse = {
  success: true;
  whatsappUrl: string;
  inquiryId: string;
};
