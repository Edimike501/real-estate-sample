import Link from "next/link";

import { UserTable } from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <Link href="/admin/dashboard/users/new" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">
          New User
        </Link>
      </div>
      <UserTable />
    </div>
  );
}
