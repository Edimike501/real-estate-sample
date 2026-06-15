"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type BackButtonVariant = "default" | "floating" | "minimal" | "pill";

export type BackButtonProps = {
  href: string;
  label?: string;
  variant?: BackButtonVariant;
  className?: string;
  iconOnly?: boolean;
  onClick?: () => void;
  onBeforeNavigate?: () => Promise<boolean>;
};

export function BackButton({
  href,
  label = "Back",
  variant = "default",
  className,
  iconOnly = false,
  onClick,
  onBeforeNavigate,
}: BackButtonProps) {
  const router = useRouter();

  async function handleBack() {
    if (onClick) {
      onClick();
      return;
    }

    if (onBeforeNavigate) {
      const canNavigate = await onBeforeNavigate();
      if (!canNavigate) return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(href);
    }
  }

  const baseClasses =
    "inline-flex items-center gap-2 cursor-pointer transition-all duration-150 select-none active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 min-w-[44px]";

  const variantClasses: Record<BackButtonVariant, string> = {
    default:
      "min-h-[44px] px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:border-[var(--color-border-accent)] hover:text-[var(--color-accent)]",
    floating:
      "fixed top-4 left-4 z-50 min-h-[44px] min-w-[44px] px-3 py-2 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 text-white text-sm font-medium hover:bg-black/75",
    minimal:
      "min-h-[44px] py-1 text-[var(--color-text-muted)] text-sm hover:text-[var(--color-text-primary)] hover:underline",
    pill: "min-h-[44px] px-[0.85rem] py-[0.35rem] rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] text-[0.8rem] font-medium hover:bg-[var(--color-accent-muted)]/80",
  };

  const iconSize = variant === "minimal" || variant === "pill" ? 14 : 16;

  return (
    <button
      type="button"
      onClick={() => void handleBack()}
      aria-label={`Go back to ${label}`}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      <ArrowLeft size={iconSize} aria-hidden="true" />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}
