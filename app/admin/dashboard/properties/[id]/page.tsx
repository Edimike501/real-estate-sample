import { notFound } from "next/navigation";

import { PropertyDetail } from "@/components/admin/PropertyDetail";
import { prisma } from "@/lib/prisma";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, deletedAt: null },
    include: {
      media: { orderBy: { order: "asc" } },
      inquiries: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!property) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Property Detail</h1>
      <PropertyDetail property={property} />
    </div>
  );
}
