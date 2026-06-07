import Link from "next/link";
import {
  Building2,
  MessageSquare,
  Users,
  Compass,
  Star,
  Inbox,
  Clock,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { formatEnum } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [
    totalProperties,
    featuredProperties,
    propertiesByType,
    propertiesByStatus,
    totalInquiries,
    newInquiries,
    inquiriesByStatus,
    totalUsers,
    recentInquiries,
    recentProperties,
  ] = await Promise.all([
    prisma.property.count({ where: { deletedAt: null } }),
    prisma.property.count({ where: { isFeatured: true, deletedAt: null } }),
    prisma.property.groupBy({
      by: ["listingType"],
      _count: { _all: true },
      where: { deletedAt: null }
    }),
    prisma.property.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: { deletedAt: null }
    }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.groupBy({
      by: ["status"],
      _count: { _all: true }
    }),
    prisma.user.count(),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    }),
    prisma.property.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        media: {
          orderBy: { order: "asc" },
          take: 1
        }
      }
    })
  ]);

  // Transform counts to easy-to-use maps
  const typeCounts = propertiesByType.reduce((acc, curr) => {
    acc[curr.listingType] = curr._count._all;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = propertiesByStatus.reduce((acc, curr) => {
    acc[curr.status] = curr._count._all;
    return acc;
  }, {} as Record<string, number>);

  const inquiryStatusCounts = inquiriesByStatus.reduce((acc, curr) => {
    acc[curr.status] = curr._count._all;
    return acc;
  }, {} as Record<string, number>);

  // Styles for badges
  const statusBadgeStyles: Record<string, string> = {
    AVAILABLE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50",
    SOLD: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50",
    LET: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50",
    UNDER_OFFER: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50",
    COMING_SOON: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50",
  };

  const typeColorStyles: Record<string, string> = {
    SALE: "bg-blue-600",
    RENTAL: "bg-indigo-600",
    LAND: "bg-emerald-600",
    DEVELOPMENT: "bg-purple-600"
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg bg-bg-secondary border border-border p-6 shadow-sm">
        <h1 className="text-3xl font-display font-bold text-text-primary">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Welcome back. Here is a summary of your Opollo Luxury Properties activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Properties Card */}
        <div className="group rounded-lg border border-border bg-bg-secondary p-5 transition shadow-sm hover:shadow-md hover:border-accent/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-text-muted">Properties</p>
              <h3 className="mt-2 text-3xl font-bold text-text-primary tracking-tight">{totalProperties}</h3>
            </div>
            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <Building2 size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <strong>{featuredProperties}</strong> Featured
            </span>
            <Link href="/admin/dashboard/properties" className="font-semibold text-accent hover:underline flex items-center gap-0.5">
              Manage <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Inquiries Card */}
        <div className="group rounded-lg border border-border bg-bg-secondary p-5 transition shadow-sm hover:shadow-md hover:border-accent/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-text-muted">Inquiries</p>
              <h3 className="mt-2 text-3xl font-bold text-text-primary tracking-tight">{totalInquiries}</h3>
            </div>
            <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
              <MessageSquare size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Inbox size={12} className="text-emerald-500" />
              <strong>{newInquiries}</strong> New / Unread
            </span>
            <Link href="/admin/dashboard/inquiries" className="font-semibold text-accent hover:underline flex items-center gap-0.5">
              Review <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Users Card */}
        <div className="group rounded-lg border border-border bg-bg-secondary p-5 transition shadow-sm hover:shadow-md hover:border-accent/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-text-muted">System Users</p>
              <h3 className="mt-2 text-3xl font-bold text-text-primary tracking-tight">{totalUsers}</h3>
            </div>
            <div className="rounded-lg bg-purple-100 p-2.5 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50">
              <Users size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-purple-500" />
              Authorized Access
            </span>
            <Link href="/admin/dashboard/users" className="font-semibold text-accent hover:underline flex items-center gap-0.5">
              Manage <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Breakdown Breakdown Segment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Properties Breakdown */}
        <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 pb-3 border-b border-border/80">
            <Compass size={18} className="text-accent" />
            Properties by Listing & Status
          </h2>
          <div className="mt-4 space-y-4">
            {/* Listing Types */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Listing Type</h4>
              <div className="space-y-2">
                {["SALE", "RENTAL", "LAND", "DEVELOPMENT"].map((type) => {
                  const count = typeCounts[type] || 0;
                  const pct = totalProperties > 0 ? (count / totalProperties) * 100 : 0;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium text-text-primary">
                        <span>{formatEnum(type)}</span>
                        <span>{count} ({Math.round(pct)}%)</span>
                      </div>
                      <div className="h-2 w-full rounded bg-bg-tertiary overflow-hidden">
                        <div
                          className={`h-full rounded ${typeColorStyles[type] || "bg-accent"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">Properties Status</h4>
              <div className="flex flex-wrap gap-2">
                {["AVAILABLE", "UNDER_OFFER", "SOLD", "LET", "COMING_SOON"].map((status) => {
                  const count = statusCounts[status] || 0;
                  const badgeClass = statusBadgeStyles[status] || statusBadgeStyles.AVAILABLE;
                  return (
                    <div key={status} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badgeClass}`}>
                      <span>{formatEnum(status)}</span>
                      <span className="font-bold opacity-80 border-l border-current/25 pl-1.5">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Inquiries Breakdown */}
        <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 pb-3 border-b border-border/80">
            <Clock size={18} className="text-accent" />
            Inquiry Management Status
          </h2>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {["NEW", "CONTACTED", "FOLLOW_UP", "CLOSED", "SPAM"].map((status) => {
                const count = inquiryStatusCounts[status] || 0;
                const pct = totalInquiries > 0 ? (count / totalInquiries) * 100 : 0;
                return (
                  <div key={status} className="border border-border bg-bg-primary rounded-lg p-3">
                    <div className="flex justify-between items-center text-xs text-text-secondary">
                      <span className="font-semibold">{formatEnum(status)}</span>
                      <span>{count}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded bg-bg-tertiary overflow-hidden">
                      <div className="h-full bg-accent rounded" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="rounded-md border border-border bg-bg-primary p-3 text-xs text-text-secondary flex justify-between items-center">
              <span>Looking for detailed inquiries database?</span>
              <Link href="/admin/dashboard/inquiries" className="text-accent font-semibold flex items-center gap-0.5 hover:underline">
                Open Inquiries <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity lists */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Inquiries */}
        <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <MessageSquare size={18} className="text-accent" />
              Recent Inquiries
            </h2>
            <Link href="/admin/dashboard/inquiries" className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate">{inquiry.guestName}</p>
                    <p className="text-text-muted mt-0.5 truncate">{inquiry.guestPhone}</p>
                    {inquiry.property && (
                      <p className="text-text-secondary mt-1 italic truncate">
                        Re: {inquiry.property.title}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className="text-[10px] text-text-muted">
                      {new Intl.DateTimeFormat("en", { dateStyle: "short" }).format(new Date(inquiry.createdAt))}
                    </span>
                    <Link
                      href={`/admin/dashboard/inquiries/${inquiry.id}`}
                      className="inline-flex items-center gap-0.5 text-accent font-semibold hover:underline"
                    >
                      View <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-text-muted">No inquiries logged yet.</p>
            )}
          </div>
        </div>

        {/* Recently Added Properties */}
        <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Building2 size={18} className="text-accent" />
              Recently Added Properties
            </h2>
            <Link href="/admin/dashboard/properties" className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {recentProperties.length > 0 ? (
              recentProperties.map((property) => {
                const preview = property.media?.[0]?.thumbnailUrl ?? property.media?.[0]?.url ?? "/images/property-placeholder.png";
                const badgeStyle = statusBadgeStyles[property.status] || statusBadgeStyles.AVAILABLE;
                return (
                  <div key={property.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-14 shrink-0 rounded border border-border overflow-hidden bg-bg-primary">
                        <Image
                          src={preview}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary truncate">{property.title}</p>
                        <p className="text-text-muted mt-0.5 truncate">{property.city}, {property.state}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle}`}>
                        {formatEnum(property.status)}
                      </span>
                      <Link
                        href={`/admin/dashboard/properties/${property.id}/edit`}
                        className="inline-flex items-center gap-0.5 text-accent font-semibold hover:underline"
                      >
                        Edit <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-center text-sm text-text-muted">No properties created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
