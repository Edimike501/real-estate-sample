"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/dashboard/properties", label: "Properties" },
  { href: "/admin/dashboard/inquiries", label: "Inquiries" },
  { href: "/admin/dashboard/users", label: "Users" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full rounded-lg border border-border bg-bg-secondary p-4 lg:w-64">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">Admin</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-md px-3 py-2 text-sm ${
              pathname === link.href ? "bg-accent text-white" : "text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
