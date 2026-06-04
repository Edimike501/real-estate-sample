import { notFound } from "next/navigation";

import { InquiryForm } from "@/components/property/InquiryForm";
import { PropertyDetailHero } from "@/components/property/PropertyDetailHero";
import { PropertyMap } from "@/components/property/PropertyMap";
import { prisma } from "@/lib/prisma";

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await prisma.property.findFirst({
    where: {
      slug,
      deletedAt: null,
    },
    include: {
      media: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!property) notFound();

  return (
    <main className="section-padding bg-bg-primary min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <PropertyDetailHero property={property} />
          <section className="rounded-lg border border-border bg-bg-secondary p-6">
            <h2 className="mb-3 text-xl font-semibold text-text-primary">Property Description</h2>
            <p className="whitespace-pre-line text-text-secondary">{property.description}</p>
          </section>
          <PropertyMap
            latitude={property.latitude}
            longitude={property.longitude}
            address={property.address}
            landmark={property.landmark}
            propertyTitle={property.title}
          />
        </div>
        <div className="space-y-6">
          <InquiryForm propertyId={property.id} />
        </div>
      </div>
    </main>
  );
}
