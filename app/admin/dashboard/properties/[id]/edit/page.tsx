import { notFound } from "next/navigation";

import { PropertyFormPageContent } from "@/components/admin/PropertyFormPageContent";
import { prisma } from "@/lib/prisma";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, deletedAt: null },
    include: { media: { orderBy: { order: "asc" } } },
  });

  if (!property) notFound();

  return (
    <PropertyFormPageContent
      title={`Edit ${property.title}`}
      property={property}
    />
  );
}
