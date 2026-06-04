import Link from "next/link";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { type User } from "@/types";

type UserDetailProps = {
  user: User;
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function UserDetail({ user }: UserDetailProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{user.name}</h2>
          <p className="text-sm text-text-secondary">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/dashboard/users/${user.id}/edit`}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Edit User
          </Link>
          <AdminDeleteButton
            endpoint={`/api/users/${user.id}`}
            label="Delete User"
            confirmMessage={`Delete "${user.name}"?`}
            redirectTo="/admin/dashboard/users"
          />
        </div>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-text-muted">Role</dt><dd className="text-text-primary">{user.role}</dd></div>
        <div><dt className="text-text-muted">Status</dt><dd className="text-text-primary">{user.isActive ? "Active" : "Inactive"}</dd></div>
        <div><dt className="text-text-muted">Created</dt><dd className="text-text-primary">{formatDate(user.createdAt)}</dd></div>
        <div><dt className="text-text-muted">Updated</dt><dd className="text-text-primary">{formatDate(user.updatedAt)}</dd></div>
      </dl>
    </div>
  );
}
