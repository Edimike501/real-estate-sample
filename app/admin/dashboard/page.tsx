import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [properties, inquiries, users] = await Promise.all([
    prisma.property.count({ where: { deletedAt: null } }),
    prisma.inquiry.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-text-muted">Properties</p>
          <p className="text-2xl font-bold text-text-primary">{properties}</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-text-muted">Inquiries</p>
          <p className="text-2xl font-bold text-text-primary">{inquiries}</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-text-muted">Users</p>
          <p className="text-2xl font-bold text-text-primary">{users}</p>
        </div>
      </div>
    </div>
  );
}
