"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Users,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Settings
} from "lucide-react";

import Logo from "@/components/ui/Logo";
import { formatEnum } from "@/lib/utils";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

const links = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/admin/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/dashboard/users", label: "Users", icon: Users },
  { href: "/admin/dashboard/settings", label: "Settings", icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentRole = user?.role || "ADMIN";
  const filteredLinks = links.filter((link) => {
    if (link.href === "/admin/dashboard/users") {
      return currentRole === "SUPER_ADMIN";
    }
    return true;
  });

  // Get current active link label
  const activeLink = filteredLinks.find((link) => isActivePath(pathname, link.href)) || filteredLinks[0];

  function handleSignOut() {
    signOut({ callbackUrl: "/admin/login" });
  }

  const roleStyles: Record<string, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50",
    ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50",
    VIEWER: "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300 border border-gray-200 dark:border-gray-700/50"
  };

  const roleClass = roleStyles[currentRole] || roleStyles.ADMIN;

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:h-full lg:w-64 lg:shrink-0 lg:flex-col bg-bg-secondary border-r border-border p-5 justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="pb-4 border-b border-border/80">
            <Logo href="/admin/dashboard" showText={true} width={36} height={36} />
          </div>

          <nav className="space-y-1">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-white shadow-sm shadow-accent/20"
                      : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-text-muted"} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile at the bottom */}
        {user && (
          <div className="pt-4 border-t border-border/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 border border-accent/20 text-accent">
                <UserIcon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {user.name}
                </p>
                <p className="truncate text-xs text-text-muted">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${roleClass}`}>
                {formatEnum(currentRole)}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-red-400 transition-colors"
                title="Log Out"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* 2. Mobile Sticky Top Header */}
      <div className="lg:hidden w-full bg-bg-secondary border border-border rounded-lg p-4 flex items-center justify-between mb-4 sticky top-4 z-30 shadow-sm">
        <Logo href="/admin/dashboard" showText={true} width={32} height={32} />

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-text-secondary bg-bg-tertiary px-2.5 py-1 rounded-md border border-border">
            {activeLink.label}
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg border border-border hover:border-accent text-text-primary transition-colors bg-bg-primary"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-bg-secondary border-r border-border p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/80">
                <Logo href="/admin/dashboard" showText={true} width={34} height={34} />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md border border-border text-text-primary hover:border-red-400 hover:text-red-400 transition-colors bg-bg-primary"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-1">
                {filteredLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActivePath(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent text-white shadow-sm"
                          : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-white" : "text-text-muted"} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Profile at bottom of drawer */}
            {user && (
              <div className="pt-4 border-t border-border/85 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 border border-accent/20 text-accent">
                    <UserIcon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${roleClass}`}>
                    {formatEnum(currentRole)}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-red-400 transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
