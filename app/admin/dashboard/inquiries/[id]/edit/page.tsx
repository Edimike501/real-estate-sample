import { notFound } from "next/navigation";

import { InquiryEditForm } from "@/components/admin/InquiryEditForm";
import { prisma } from "@/lib/prisma";

export default async function EditInquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({ where: { id } });

  if (!inquiry) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Edit Inquiry</h1>
      <InquiryEditForm inquiry={inquiry} />
    </div>
  );
}
