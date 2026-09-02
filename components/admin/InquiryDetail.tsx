"use client";

import {
  ArrowLeft,
  Building,
  Calendar,
  Check,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  User
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { formatEnum } from "@/lib/utils";
import { type Inquiry } from "@/types";

type InquiryDetailInquiry = Omit<Inquiry, "property"> & {
  property?: {
    id: string;
    title: string;
    slug: string;
    city: string;
    lga?: string | null;
    state: string;
  } | null;
};

type InquiryDetailProps = {
  inquiry: InquiryDetailInquiry;
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function InquiryDetail({ inquiry }: InquiryDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inquiry.whatsappMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  const statusBadgeStyles: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800 dark:bg-blue-950/45 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50",
    CONTACTED:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/45 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50",
    FOLLOW_UP:
      "bg-purple-100 text-purple-800 dark:bg-purple-950/45 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50",
    CLOSED:
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50",
    SPAM: "bg-red-100 text-red-800 dark:bg-red-950/45 dark:text-red-300 border border-red-200 dark:border-red-900/50"
  };

  const statusClass =
    statusBadgeStyles[inquiry.status] || statusBadgeStyles.NEW;
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/properties/${inquiry.property?.slug}`;

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-secondary border border-border p-4 rounded-lg shadow-sm">
        <Link
          href="/admin/dashboard/inquiries"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={14} />
          Back to Inquiries
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/dashboard/inquiries/${inquiry.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition">
            <Edit size={14} />
            Edit Status / Notes
          </Link>
          <AdminDeleteButton
            endpoint={`/api/inquiries/${inquiry.id}`}
            label="Delete Inquiry"
            confirmMessage={`Are you sure you want to delete this inquiry from "${inquiry.guestName}"?`}
            redirectTo="/admin/dashboard/inquiries"
          />
        </div>
      </div>

      {/* 2. Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Guest Profile & Message Contents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Card */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center gap-1.5">
              <User size={16} className="text-accent" />
              Guest Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-bg-primary p-3 rounded-lg border border-border/50 space-y-1">
                <span className="text-text-muted block">Guest Name</span>
                <span className="font-bold text-sm text-text-primary block">
                  {inquiry.guestName}
                </span>
              </div>

              <div className="bg-bg-primary p-3 rounded-lg border border-border/50 space-y-1">
                <span className="text-text-muted block">Phone Number</span>
                <a
                  href={`tel:${inquiry.guestPhone}`}
                  className="font-bold text-sm text-accent hover:underline flex items-center gap-1">
                  <Phone size={13} />
                  {inquiry.guestPhone}
                </a>
              </div>

              <div className="bg-bg-primary p-3 rounded-lg border border-border/50 space-y-1">
                <span className="text-text-muted block">Email Address</span>
                {inquiry.guestEmail ? (
                  <a
                    href={`mailto:${inquiry.guestEmail}`}
                    className="font-bold text-sm text-accent hover:underline flex items-center gap-1 truncate">
                    <Mail size={13} />
                    {inquiry.guestEmail}
                  </a>
                ) : (
                  <span className="text-text-secondary italic">
                    Not provided
                  </span>
                )}
              </div>

              <div className="bg-bg-primary p-3 rounded-lg border border-border/50 space-y-1">
                <span className="text-text-muted block">Inquiry Logged</span>
                <span className="font-bold text-sm text-text-primary flex items-center gap-1">
                  <Calendar size={13} className="text-text-muted" />
                  {formatDate(inquiry.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Guest Message */}
          {inquiry.message && (
            <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center gap-1.5">
                <MessageSquare size={16} className="text-accent" />
                Submitted Message
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary bg-bg-primary p-4 rounded-lg border border-border/60">
                &quot;{inquiry.message}&quot;
              </p>
            </div>
          )}

          {/* WhatsApp Payload details */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5">
                <MessageCircle
                  size={16}
                  className="text-emerald-600 fill-emerald-600/10"
                />
                WhatsApp Message Sent
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline cursor-pointer">
                {copied ? (
                  <>
                    <Check size={12} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy message
                  </>
                )}
              </button>
            </h3>
            <div className="bg-bg-tertiary border-l-[3px] border-accent p-4 rounded-r-lg">
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-2">
                Sent to WhatsApp: {inquiry.whatsappNumber}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary font-mono bg-bg-primary p-3.5 rounded border border-border">
                {inquiry.whatsappMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Right Columns: Meta specs, Property Card & Admin Notes */}
        <div className="space-y-6">
          {/* Metadata Badges Card */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2">
              Inquiry Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Status:</span>
                <span
                  className={`px-2.5 py-1 rounded-full font-bold ${statusClass}`}>
                  {formatEnum(inquiry.status)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-border/50">
                <span className="text-text-muted">Inquiry Source:</span>
                <span className="font-bold text-text-secondary bg-bg-primary border border-border px-2.5 py-1 rounded-md">
                  {formatEnum(inquiry.source)}
                </span>
              </div>
            </div>
          </div>

          {/* Connected Property Card */}
          {inquiry.property ? (
            <div className="rounded-lg border border-border bg-accent-muted/10 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center gap-1.5">
                <Building size={16} className="text-accent" />
                Inquired Property
              </h3>

              <div className="bg-bg-primary border border-border p-3.5 rounded-lg space-y-2 flex flex-col">
                <div>
                  <h4 className="font-bold text-sm text-text-primary leading-tight">
                    {inquiry.property.title}
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5 font-normal">
                    {[
                      inquiry.property.city,
                      inquiry.property.lga,
                      inquiry.property.state
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                <Link
                  href={`/admin/dashboard/properties/${inquiry.property.id}`}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-white hover:opacity-90 shadow-sm transition mt-2 text-center">
                  View Property Details
                </Link>

                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-accent text-accent px-3 py-2 text-xs font-semibold hover:bg-accent/5 shadow-sm transition cursor-pointer text-center">
                  <ExternalLink size={12} />
                  View Property
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm text-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center justify-center gap-1.5">
                <Building size={16} />
                Inquired Property
              </h3>
              <p className="text-xs text-text-muted py-4 italic">
                General inquiry (No property linked)
              </p>
            </div>
          )}

          {/* Admin Notes */}
          <div className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border/80 pb-2 flex items-center gap-1.5">
              <FileText size={16} className="text-accent" />
              Administrative Notes
            </h3>
            {inquiry.adminNotes ? (
              <p className="whitespace-pre-line text-xs leading-relaxed text-text-secondary bg-bg-primary p-3 rounded border border-border">
                {inquiry.adminNotes}
              </p>
            ) : (
              <p className="text-xs text-text-muted italic py-2">
                No administrative notes added yet. Edit the status to append
                internal notes for your team.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
