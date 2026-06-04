import { notFound } from "next/navigation";

import { PropertyForm } from "@/components/admin/PropertyForm";
import { prisma } from "@/lib/prisma";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, deletedAt: null },
    include: { media: { orderBy: { order: "asc" } } },
  });

  if (!property) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Edit {property.title}</h1>
      <PropertyForm property={property} />
    </div>
  );
}
