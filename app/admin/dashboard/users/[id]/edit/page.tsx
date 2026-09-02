"use client";

import { use } from "react";

import { UserForm } from "@/components/admin/UserForm";
import { BackButton } from "@/components/ui/BackButton";
import { useAdminUser } from "@/hooks/useUsers";

export default function EditUserPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: user, isLoading, isError, error } = useAdminUser(id);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-bg-secondary rounded" />
        <div className="h-64 bg-bg-secondary rounded-lg border border-border" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-4">
        <BackButton
          href="/admin/dashboard/users"
          label="Back to Users"
          variant="minimal"
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <h3 className="font-semibold text-lg">User Not Found</h3>
          <p className="mt-1 text-sm">
            {error instanceof Error ? error.message : "The requested user could not be loaded."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Edit {user.name}</h1>
      <UserForm user={user} />
    </div>
  );
}
