import { UserTable } from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Users</h1>
      <UserTable />
    </div>
  );
}
