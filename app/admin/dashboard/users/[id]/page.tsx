import { notFound } from "next/navigation";

import { UserDetail } from "@/components/admin/UserDetail";
import { prisma } from "@/lib/prisma";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">User Detail</h1>
      <UserDetail user={user} />
    </div>
  );
}
