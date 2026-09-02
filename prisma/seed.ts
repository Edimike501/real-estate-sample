import {
  ListingType,
  PriceFrequency,
  PrismaClient,
  PropertyStatus
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("PortfolioDemo2026!", 12);
  const agentPassword = await bcrypt.hash("AgentDemo2026!", 12);

  await prisma.user.upsert({
    where: { email: "admin@auraluxury.com" },
    update: { password: adminPassword },
    create: {
      name: "Aura Super Admin",
      email: "admin@auraluxury.com",
      password: adminPassword,
      role: "SUPER_ADMIN",
      isActive: true
    }
  });

  await prisma.user.upsert({
    where: { email: "agent@auraluxury.com" },
    update: { password: agentPassword },
    create: {
      name: "Aura Portfolio Agent",
      email: "agent@auraluxury.com",
      password: agentPassword,
      role: "ADMIN",
      isActive: true
    }
  });

  type PropertySeedInput = {
    slug: string;
    title: string;
    description: string;
    listingType: ListingType;
    status: PropertyStatus;
    city: string;
    state: string;
    salePrice?: number;
    rentalPrice?: number;
    priceFrequency?: PriceFrequency;
    serviceCharge?: number;
    cautionFee?: number;
    bedrooms?: number;
    bathrooms?: number;
    toilets?: number;
    sizeSqm?: number;
    furnished?: boolean;
    yearBuilt?: number;
    isFeatured?: boolean;
    isPinned?: boolean;
    latitude?: number;
    longitude?: number;
    virtualTourUrl?: string;
    media?: Array<{
      url: string;
      thumbnailUrl?: string;
      publicId: string;
      mediaType: "IMAGE" | "VIDEO";
      altText?: string;
      order: number;
    }>;
  };

  const properties: PropertySeedInput[] = [
    {
      slug: "banana-island-waterfront-penthouse",
      title: "The Grand Horizon Waterfront Penthouse",
      description:
        "Ultra-luxurious 5-bedroom penthouse atop Banana Island with panoramic Atlantic Ocean views, private infinity rooftop pool, direct elevator entry, smart home automation, and floor-to-ceiling glass walls.",
      listingType: "SALE",
      status: "AVAILABLE",
      city: "Ikoyi",
      state: "Lagos",
      salePrice: 1250000000,
      bedrooms: 5,
      bathrooms: 5,
      toilets: 6,
      sizeSqm: 850,
      furnished: true,
      yearBuilt: 2024,
      isFeatured: true,
      isPinned: true,
      latitude: 6.4625,
      longitude: 3.441,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41566-large.mp4",
      media: [
        {
          url: "/images/properties/banana-island-penthouse-ext.jpg",
          thumbnailUrl: "/images/properties/banana-island-penthouse-ext.jpg",
          publicId: "banana-island-penthouse-ext",
          mediaType: "IMAGE",
          altText: "Banana Island Penthouse Exterior & Skyline Terrace",
          order: 0
        },
        {
          url: "/images/properties/banana-island-penthouse-int.jpg",
          thumbnailUrl: "/images/properties/banana-island-penthouse-int.jpg",
          publicId: "banana-island-penthouse-int",
          mediaType: "IMAGE",
          altText: "Opulent Double Height Living Room Interior",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
          publicId: "banana-island-deck",
          mediaType: "IMAGE",
          altText: "Rooftop infinity pool lounge",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41566-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
          publicId: "banana-island-video-tour",
          mediaType: "VIDEO",
          altText: "Cinematic Video Walkthrough - Banana Island Penthouse",
          order: 3
        }
      ]
    },
    {
      slug: "ikoyi-executive-serviced-apartment",
      title: "Ikoyi Executive 3-Bedroom Serviced Apartment",
      description:
        "Premium fully serviced residence on Glover Road, Ikoyi. Features 24/7 concierge service, power supply, Olimpia Italian kitchen appliances, communal swimming pool, and fully equipped gym.",
      listingType: "RENTAL",
      status: "AVAILABLE",
      city: "Ikoyi",
      state: "Lagos",
      rentalPrice: 22000000,
      priceFrequency: "PER_YEAR",
      serviceCharge: 3500000,
      cautionFee: 2000000,
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      sizeSqm: 320,
      furnished: true,
      yearBuilt: 2023,
      isFeatured: true,
      isPinned: false,
      latitude: 6.4541,
      longitude: 3.4302,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-living-room-41569-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80",
          publicId: "ikoyi-serviced-ext",
          mediaType: "IMAGE",
          altText: "Glover Road Gated Apartment Facade",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
          publicId: "ikoyi-serviced-int",
          mediaType: "IMAGE",
          altText: "Spacious Living Area with Natural Lighting",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80",
          publicId: "ikoyi-serviced-kitchen",
          mediaType: "IMAGE",
          altText: "Marble Kitchen Island & Built-in Appliances",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-living-room-41569-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80",
          publicId: "ikoyi-serviced-video",
          mediaType: "VIDEO",
          altText: "High Definition Video Tour - Ikoyi Executive Apartment",
          order: 3
        }
      ]
    },
    {
      slug: "lekki-royal-palm-luxury-villa",
      title: "Royal Palm 5-Bedroom Detached Villa",
      description:
        "Modern minimalist contemporary villa in Lekki Phase 1 featuring private infinity pool, wooden outdoor sun deck, smart locks, biometric security, and dedicated maid quarter.",
      listingType: "SALE",
      status: "AVAILABLE",
      city: "Lekki",
      state: "Lagos",
      salePrice: 480000000,
      bedrooms: 5,
      bathrooms: 5,
      toilets: 6,
      sizeSqm: 600,
      furnished: true,
      yearBuilt: 2025,
      isFeatured: true,
      isPinned: true,
      latitude: 6.448,
      longitude: 3.475,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-a-window-of-a-modern-house-41571-large.mp4",
      media: [
        {
          url: "/images/properties/lekki-villa-ext.jpg",
          thumbnailUrl: "/images/properties/lekki-villa-ext.jpg",
          publicId: "lekki-villa-ext",
          mediaType: "IMAGE",
          altText: "Royal Palm Detached Villa & Swimming Pool",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80",
          publicId: "lekki-villa-pool",
          mediaType: "IMAGE",
          altText: "Infinity Swimming Pool Deck",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80",
          publicId: "lekki-villa-master",
          mediaType: "IMAGE",
          altText: "Master Bedroom Suite with Walk-in Closet",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-a-window-of-a-modern-house-41571-large.mp4",
          thumbnailUrl: "/images/properties/lekki-villa-ext.jpg",
          publicId: "lekki-villa-video",
          mediaType: "VIDEO",
          altText: "Architectural Video Showcase - Lekki Royal Villa",
          order: 3
        }
      ]
    },
    {
      slug: "eko-atlantic-sky-tower-residence",
      title: "Eko Pearl Sky Tower Luxury Apartment",
      description:
        "High-floor 3-bedroom waterfront apartment in Eko Atlantic City with panoramic views of the ocean marina, central HVAC, infinity swimming pool, and underground parking.",
      listingType: "SALE",
      status: "AVAILABLE",
      city: "Victoria Island",
      state: "Lagos",
      salePrice: 650000000,
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      sizeSqm: 410,
      furnished: false,
      yearBuilt: 2024,
      isFeatured: true,
      latitude: 6.4205,
      longitude: 3.415,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41566-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80",
          publicId: "eko-pearl-lounge",
          mediaType: "IMAGE",
          altText: "Eko Pearl Sky Lounge & Skyline View",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80",
          publicId: "eko-pearl-bed",
          mediaType: "IMAGE",
          altText: "Bedroom View over Eko Atlantic Marina",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
          publicId: "eko-pearl-living",
          mediaType: "IMAGE",
          altText: "Contemporary Open Plan Dining & Living",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41566-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80",
          publicId: "eko-pearl-video",
          mediaType: "VIDEO",
          altText: "3D Virtual Tour Video - Eko Pearl Tower",
          order: 3
        }
      ]
    },
    {
      slug: "vi-imperial-penthouse-rental",
      title: "Victoria Imperial Rooftop Penthouse",
      description:
        "Architectural masterpiece located off Ahmadu Bello Way in Victoria Island. Features exclusive rooftop cocktail bar, heated plunge pool, private elevator, and smart security system.",
      listingType: "RENTAL",
      status: "AVAILABLE",
      city: "Victoria Island",
      state: "Lagos",
      rentalPrice: 35000000,
      priceFrequency: "PER_YEAR",
      serviceCharge: 4000000,
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      sizeSqm: 520,
      furnished: true,
      yearBuilt: 2024,
      isFeatured: true,
      latitude: 6.4281,
      longitude: 3.4219,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-living-room-41569-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=400&q=80",
          publicId: "vi-imperial-ext",
          mediaType: "IMAGE",
          altText: "Victoria Island Imperial Residence Exterior",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=400&q=80",
          publicId: "vi-imperial-kitchen",
          mediaType: "IMAGE",
          altText: "Chef Kitchen & Breakfast Bar",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=400&q=80",
          publicId: "vi-imperial-lounge",
          mediaType: "IMAGE",
          altText: "Private Rooftop Lounge & Terrace",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-living-room-41569-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=400&q=80",
          publicId: "vi-imperial-video",
          mediaType: "VIDEO",
          altText: "Exclusive Video Walkthrough - Victoria Imperial Penthouse",
          order: 3
        }
      ]
    },
    {
      slug: "maitama-crown-mansion-abuja",
      title: "The Maitama Crown Diplomatic Mansion",
      description:
        "Palatial 6-bedroom smart mansion in prime Maitama, Abuja. Includes bulletproof security doors, double-height grand entrance, automated perimeter solar fencing, and Olympic size pool.",
      listingType: "SALE",
      status: "AVAILABLE",
      city: "Maitama",
      state: "Abuja",
      salePrice: 1850000000,
      bedrooms: 6,
      bathrooms: 6,
      toilets: 8,
      sizeSqm: 1200,
      furnished: true,
      yearBuilt: 2024,
      isFeatured: true,
      isPinned: true,
      latitude: 9.0882,
      longitude: 7.495,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-a-window-of-a-modern-house-41571-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80",
          publicId: "maitama-mansion-ext",
          mediaType: "IMAGE",
          altText: "Maitama Mansion Facade & manicured lawns",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80",
          publicId: "maitama-mansion-foyer",
          mediaType: "IMAGE",
          altText: "Double-Height Grand Foyer & Chandelier",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
          publicId: "maitama-mansion-bath",
          mediaType: "IMAGE",
          altText: "Ensuite Luxury Spa Bathroom",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-a-window-of-a-modern-house-41571-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80",
          publicId: "maitama-mansion-video",
          mediaType: "VIDEO",
          altText: "Diplomatic Mansion Tour - Maitama Abuja",
          order: 3
        }
      ]
    },
    {
      slug: "ikeja-gra-executive-apartment",
      title: "Ikeja GRA Garden View Apartment",
      description:
        "Modern 3-bedroom apartment on Isaac John Street, Ikeja GRA. Peaceful environment surrounded by lush trees, featuring 24-hour security, fitness center, solar backup inverter system, and swimming pool.",
      listingType: "RENTAL",
      status: "AVAILABLE",
      city: "Ikeja",
      state: "Lagos",
      rentalPrice: 15000000,
      priceFrequency: "PER_YEAR",
      serviceCharge: 2500000,
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      sizeSqm: 260,
      furnished: true,
      yearBuilt: 2023,
      isFeatured: false,
      latitude: 6.589,
      longitude: 3.355,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41566-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=400&q=80",
          publicId: "ikeja-gra-ext",
          mediaType: "IMAGE",
          altText: "Ikeja GRA Garden Apartment Building",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=400&q=80",
          publicId: "ikeja-gra-bed",
          mediaType: "IMAGE",
          altText: "Spacious Suite Bedroom",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
          publicId: "ikeja-gra-lounge",
          mediaType: "IMAGE",
          altText: "Cozy Scandinavia Inspired Living Room",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41566-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=400&q=80",
          publicId: "ikeja-gra-video",
          mediaType: "VIDEO",
          altText: "Video Tour - Ikeja GRA Apartment",
          order: 3
        }
      ]
    },
    {
      slug: "chevron-crest-luxury-terrace",
      title: "Chevron Crest 4-Bedroom Townhome Terrace",
      description:
        "Sleek contemporary 4-bedroom terrace townhome off Chevron Drive, Lekki. Fitted with German kitchen cabinetry, stamped concrete driveway, family lounge, and private balcony.",
      listingType: "SALE",
      status: "AVAILABLE",
      city: "Lekki",
      state: "Lagos",
      salePrice: 165000000,
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      sizeSqm: 380,
      furnished: false,
      yearBuilt: 2024,
      isFeatured: true,
      latitude: 6.439,
      longitude: 3.535,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-living-room-41569-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80",
          publicId: "chevron-terrace-ext",
          mediaType: "IMAGE",
          altText: "Chevron Terrace Front Facade",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80",
          publicId: "chevron-terrace-int",
          mediaType: "IMAGE",
          altText: "Bright Open Concept Living Room",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80",
          publicId: "chevron-terrace-kitchen",
          mediaType: "IMAGE",
          altText: "Modern Fitted Kitchen with Cooker Hood",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-living-room-41569-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80",
          publicId: "chevron-terrace-video",
          mediaType: "VIDEO",
          altText: "Full Video Tour - Chevron Crest Terrace",
          order: 3
        }
      ]
    },
    {
      slug: "katampe-hilltop-luxury-estate-abuja",
      title: "Katampe Hilltop Panoramic Residence",
      description:
        "Architecturally designed 5-bedroom villa perched on Katampe Hill, Abuja. Offers unmatched sunset views across the Federal Capital Territory, outdoor swimming pool, and private elevator.",
      listingType: "SALE",
      status: "AVAILABLE",
      city: "Katampe",
      state: "Abuja",
      salePrice: 950000000,
      bedrooms: 5,
      bathrooms: 5,
      toilets: 6,
      sizeSqm: 720,
      furnished: true,
      yearBuilt: 2024,
      isFeatured: true,
      latitude: 9.112,
      longitude: 7.465,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-a-window-of-a-modern-house-41571-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80",
          publicId: "katampe-hilltop-ext",
          mediaType: "IMAGE",
          altText: "Katampe Hilltop Villa & Panoramic Sunset",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=400&q=80",
          publicId: "katampe-hilltop-pool",
          mediaType: "IMAGE",
          altText: "Outdoor Pool Deck overlooking Abuja skyline",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80",
          publicId: "katampe-hilltop-master",
          mediaType: "IMAGE",
          altText: "Master Bedroom Terrace Suite",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-a-window-of-a-modern-house-41571-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80",
          publicId: "katampe-hilltop-video",
          mediaType: "VIDEO",
          altText: "Cinematic Hilltop Villa Tour - Abuja",
          order: 3
        }
      ]
    },
    {
      slug: "old-ikoyi-heritage-mansion",
      title: "Old Ikoyi Classic Heritage Mansion",
      description:
        "Stately 6-bedroom colonial-modern fusion mansion situated on Bourdillon Road, Old Ikoyi. Spans over 1,500 sqm land with mature trees, tennis court, wine cellar, and security quarters.",
      listingType: "SALE",
      status: "AVAILABLE",
      city: "Ikoyi",
      state: "Lagos",
      salePrice: 2200000000,
      bedrooms: 6,
      bathrooms: 6,
      toilets: 8,
      sizeSqm: 1500,
      furnished: true,
      yearBuilt: 2022,
      isFeatured: true,
      latitude: 6.451,
      longitude: 3.438,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-living-room-41569-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80",
          publicId: "old-ikoyi-ext",
          mediaType: "IMAGE",
          altText: "Old Ikoyi Mansion Exterior Grounds",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=400&q=80",
          publicId: "old-ikoyi-dining",
          mediaType: "IMAGE",
          altText: "Formal 12-Seater Dining Hall",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=400&q=80",
          publicId: "old-ikoyi-library",
          mediaType: "IMAGE",
          altText: "Private Mahogany Wood Study & Library",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-living-room-41569-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80",
          publicId: "old-ikoyi-video",
          mediaType: "VIDEO",
          altText: "Heritage Estate Video Walkthrough - Old Ikoyi",
          order: 3
        }
      ]
    },
    {
      slug: "nicon-town-luxury-smart-villa",
      title: "Nicon Town Automated Smart Villa",
      description:
        "State-of-the-art 5-bedroom smart home villa in Nicon Town Estate, Lekki. Controlled via tablet for lighting, climate, blinds, and multi-room audio, featuring private cinema room.",
      listingType: "SALE",
      status: "AVAILABLE",
      city: "Lekki",
      state: "Lagos",
      salePrice: 720000000,
      bedrooms: 5,
      bathrooms: 5,
      toilets: 6,
      sizeSqm: 550,
      furnished: true,
      yearBuilt: 2024,
      isFeatured: true,
      latitude: 6.442,
      longitude: 3.51,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-a-window-of-a-modern-house-41571-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
          publicId: "nicon-town-ext",
          mediaType: "IMAGE",
          altText: "Nicon Town Smart Villa Architecture",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80",
          publicId: "nicon-town-cinema",
          mediaType: "IMAGE",
          altText: "Automated Dolby Atmos Home Cinema Room",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=400&q=80",
          publicId: "nicon-town-pool",
          mediaType: "IMAGE",
          altText: "Illuminated Nighttime Pool & Patio",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-a-window-of-a-modern-house-41571-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
          publicId: "nicon-town-video",
          mediaType: "VIDEO",
          altText: "Smart Home Tech Video Tour - Nicon Town",
          order: 3
        }
      ]
    },
    {
      slug: "guzape-skyview-luxury-penthouse-abuja",
      title: "Guzape Skyview Diplomatic Penthouse",
      description:
        "High-altitude 4-bedroom penthouse in Guzape Heights, Abuja. Breathtaking views over Asokoro and Central Business District, featuring heated private jacuzzi on the deck.",
      listingType: "RENTAL",
      status: "AVAILABLE",
      city: "Guzape",
      state: "Abuja",
      rentalPrice: 28000000,
      priceFrequency: "PER_YEAR",
      serviceCharge: 3000000,
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      sizeSqm: 460,
      furnished: true,
      yearBuilt: 2024,
      isFeatured: true,
      latitude: 9.043,
      longitude: 7.521,
      virtualTourUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41566-large.mp4",
      media: [
        {
          url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
          publicId: "guzape-skyview-ext",
          mediaType: "IMAGE",
          altText: "Guzape Penthouse Overlook & Jacuzzi Deck",
          order: 0
        },
        {
          url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80",
          publicId: "guzape-skyview-living",
          mediaType: "IMAGE",
          altText: "Penthouse Lounge with City Lights View",
          order: 1
        },
        {
          url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80",
          publicId: "guzape-skyview-terrace",
          mediaType: "IMAGE",
          altText: "Panoramic Terrace Dining Area",
          order: 2
        },
        {
          url: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41566-large.mp4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
          publicId: "guzape-skyview-video",
          mediaType: "VIDEO",
          altText: "Diplomatic Penthouse Video Walkthrough - Guzape Abuja",
          order: 3
        }
      ]
    }
  ];

  console.log("🌱 Starting database seed...");

  for (const { media, ...propertyData } of properties) {
    const createdProperty = await prisma.property.upsert({
      where: { slug: propertyData.slug },
      update: propertyData,
      create: propertyData
    });

    // Delete existing media for this property to avoid duplicate seed items
    await prisma.propertyMedia.deleteMany({
      where: { propertyId: createdProperty.id }
    });

    // Insert rich media items (Images and Videos)
    if (media && media.length > 0) {
      await prisma.propertyMedia.createMany({
        data: media.map((item) => ({
          propertyId: createdProperty.id,
          url: item.url,
          thumbnailUrl: item.thumbnailUrl,
          publicId: item.publicId,
          mediaType: item.mediaType as "IMAGE" | "VIDEO",
          altText: item.altText,
          order: item.order
        }))
      });
    }
  }

  console.log(
    `🏡 Created ${properties.length} luxury properties with full media assets & videos.`
  );
  console.log("✅ Database seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
