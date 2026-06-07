import {
  ArrowLeft,
  Calendar,
  Edit,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { formatEnum } from "@/lib/utils";
import { type User } from "@/types";

type UserDetailProps = {
  user: User;
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function UserDetail({ user }: UserDetailProps) {
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";

  // Role explanations for clarity & premium UI feel
  const roleExplanations: Record<
    string,
    { label: string; desc: string; icon: React.ElementType; color: string }
  > = {
    SUPER_ADMIN: {
      label: "Super Administrator",
      desc: "Full system control. Permission to manage all properties, delete records, view analytics, and create/deactivate administrators.",
      icon: ShieldAlert,
      color:
        "text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40"
    },
    ADMIN: {
      label: "Administrator",
      desc: "Administrative privileges. Permission to add/modify properties, upload media, edit detailed listing information, and manage guest inquiries.",
      icon: ShieldCheck,
      color:
        "text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40"
    },
    VIEWER: {
      label: "Viewer",
      desc: "Read-only access. Permission to view analytics, search property records, and review inquiry details without editing permissions.",
      icon: Shield,
      color:
        "text-gray-600 bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700/40"
    }
  };

  const currentRole = user.role || "ADMIN";
  const roleMeta = roleExplanations[currentRole] || roleExplanations.ADMIN;
  const RoleIconComponent = roleMeta.icon;

  const statusBadgeClass = user.isActive
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
    : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50";

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-secondary border border-border p-4 rounded-lg shadow-sm">
        <Link
          href="/admin/dashboard/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={14} />
          Back to Users
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/dashboard/users/${user.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition">
            <Edit size={14} />
            Edit User
          </Link>
          <AdminDeleteButton
            endpoint={`/api/users/${user.id}`}
            label="Delete User"
            confirmMessage={`Are you sure you want to permanently delete "${user.name}"?`}
            redirectTo="/admin/dashboard/users"
          />
        </div>
      </div>

      {/* 2. User Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Profile & Status Card */}
        <div className="rounded-lg border border-border bg-bg-secondary p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1565c0,#42a5f5)] text-white text-3xl font-display font-bold shadow-md">
            {initial}
            <span className="absolute bottom-1 right-1 flex h-4 w-4 rounded-full border-2 border-bg-secondary bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-display font-bold text-text-primary leading-tight">
              {user.name}
            </h2>
            <p className="text-xs text-text-secondary font-medium flex items-center justify-center gap-1">
              <Mail size={12} className="text-text-muted" />
              {user.email}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeClass}`}>
              {user.isActive ? "Active" : "Deactivated"}
            </span>
            <span className="bg-bg-tertiary border border-border text-text-secondary px-3 py-1 rounded-full text-xs font-bold">
              {formatEnum(currentRole)}
            </span>
          </div>
        </div>

        {/* Right Card: Role Permissions & Audit Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Permissions explanation */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center gap-1.5">
              <UserIcon size={16} className="text-accent" />
              Account Permissions & Role
            </h3>

            <div
              className={`p-4 rounded-lg border flex items-start gap-3.5 ${roleMeta.color}`}>
              <div className="mt-0.5 shrink-0">
                <RoleIconComponent size={20} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm">{roleMeta.label} Role</p>
                <p className="text-xs leading-relaxed opacity-90">
                  {roleMeta.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Activity / Audit Logs */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center gap-1.5">
              <Calendar size={16} className="text-accent" />
              Account Activity Timestamps
            </h3>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-bg-primary p-3 rounded-lg border border-border/50">
                <dt className="text-text-muted font-medium mb-1">
                  Account Created
                </dt>
                <dd className="text-text-primary font-semibold text-sm">
                  {formatDate(user.createdAt)}
                </dd>
              </div>

              <div className="bg-bg-primary p-3 rounded-lg border border-border/50">
                <dt className="text-text-muted font-medium mb-1">
                  Last Updated
                </dt>
                <dd className="text-text-primary font-semibold text-sm">
                  {formatDate(user.updatedAt)}
                </dd>
              </div>

              {user.createdBy && (
                <div className="bg-bg-primary p-3 rounded-lg border border-border/50 md:col-span-2">
                  <dt className="text-text-muted font-medium mb-1">
                    Created By
                  </dt>
                  <dd className="text-text-primary font-semibold text-sm">
                    {user.createdBy}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
