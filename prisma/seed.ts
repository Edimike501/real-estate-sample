import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("atu-superadmin-secret!@#", 12);

  await prisma.user.upsert({
    where: { email: "superadmin@opolloluxuries.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@opolloluxuries.com",
      password: adminPassword,
      role: "SUPER_ADMIN",
      isActive: true
    }
  });

  const properties = [
    {
      slug: "lekki-luxury-sale-duplex",
      title: "Luxury 4-Bedroom Duplex",
      description:
        "Premium finished duplex in Lekki with private cinema and rooftop lounge.",
      listingType: "SALE",
      city: "Lekki",
      state: "Lagos",
      salePrice: 240000000,
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      isFeatured: true,
      isPinned: true,
      latitude: 6.4412,
      longitude: 3.4828
    },
    {
      slug: "ikoyi-premium-rental",
      title: "Executive 3-Bedroom Apartment",
      description:
        "Serviced apartment in Ikoyi with smart home controls and concierge.",
      listingType: "RENTAL",
      city: "Ikoyi",
      state: "Lagos",
      rentalPrice: 18000000,
      priceFrequency: "PER_YEAR",
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      isFeatured: true,
      latitude: 6.4541,
      longitude: 3.4302
    },
    {
      slug: "ajah-prime-land",
      title: "Prime Residential Land Plot",
      description: "Verified title residential land close to main road access.",
      listingType: "LAND",
      city: "Ajah",
      state: "Lagos",
      salePrice: 35000000,
      landSizeSqm: 648,
      titleType: "C of O",
      isFeatured: false,
      latitude: 6.4698,
      longitude: 3.5852
    },
    {
      slug: "vi-offplan-development",
      title: "Off-Plan Waterfront Residences",
      description:
        "Under-construction luxury development with phased payment plan.",
      listingType: "DEVELOPMENT",
      city: "Victoria Island",
      state: "Lagos",
      salePrice: 120000000,
      isFeatured: true,
      latitude: 6.4281,
      longitude: 3.4219
    }
  ] as const;

  for (const property of properties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: property,
      create: property
    });
  }
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
