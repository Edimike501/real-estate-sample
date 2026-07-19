import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-bg-secondary border border-border p-6 shadow-sm">
        <h1 className="text-3xl font-display font-bold text-text-primary">Account Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your profile details and update your security credentials.
        </p>
      </div>
      <ChangePasswordForm user={user} />
    </div>
  );
}
