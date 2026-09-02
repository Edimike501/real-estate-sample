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
    <div className="fixed inset-0 flex w-full h-full overflow-hidden bg-bg-primary">
      <Sidebar user={session?.user} />
      <main className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden p-4 lg:p-6">
        <div className="mx-auto max-w-7xl w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
