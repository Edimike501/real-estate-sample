"use client";

import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { useCurrentUser } from "@/hooks/useUsers";

export default function SettingsPage() {
  const { data: user, isLoading, isError, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 rounded-lg bg-bg-secondary border border-border" />
        <div className="h-64 rounded-lg bg-bg-secondary border border-border" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        <h3 className="font-semibold text-lg">Error loading account profile</h3>
        <p className="mt-1 text-sm">
          {error instanceof Error ? error.message : "Failed to load user profile."}
        </p>
      </div>
    );
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
