import { notFound } from "next/navigation";

import { InquiryDetail } from "@/components/admin/InquiryDetail";
import { prisma } from "@/lib/prisma";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          city: true,
          state: true,
        },
      },
    },
  });

  if (!inquiry) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Inquiry Detail</h1>
      <InquiryDetail inquiry={inquiry} />
    </div>
  );
}
