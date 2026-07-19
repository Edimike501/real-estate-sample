import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/admin/Sidebar";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-bg-primary p-4 lg:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-start">
        <Sidebar user={session?.user} />
        <section className="flex-1">{children}</section>
      </div>
    </main>
  );
}
