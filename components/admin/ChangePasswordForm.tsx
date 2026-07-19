"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User as UserIcon,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  X,
  Lock
} from "lucide-react";
import { type User } from "@/types";
import { formatEnum } from "@/lib/utils";

interface ChangePasswordFormProps {
  user: Omit<User, "password">;
}

export function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const hasMinLength = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = hasMinLength && passwordsMatch && currentPassword.length > 0;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setStatus("success");
        router.refresh();
      } else {
        const errorMsg = data?.error ?? "Failed to change password.";
        setStatus(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setStatus(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  const roleStyles: Record<string, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50",
    ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50",
    VIEWER: "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300 border border-gray-200 dark:border-gray-700/50"
  };

  const currentRole = user.role || "ADMIN";
  const roleClass = roleStyles[currentRole] || roleStyles.ADMIN;

  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(user.createdAt));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Profile Details Card */}
      <div className="flex flex-col items-center text-center p-6 bg-bg-secondary border border-border rounded-lg shadow-sm space-y-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 border border-accent/20 text-accent">
          <UserIcon size={36} />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-text-primary">{user.name}</h2>
          <p className="text-xs text-text-muted">{user.email}</p>
        </div>
        
        <div className="w-full pt-4 border-t border-border/80 space-y-3 text-left text-xs">
          <div className="flex justify-between items-center">
            <span className="text-text-muted font-medium">Role</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${roleClass}`}>
              {formatEnum(currentRole)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted font-medium">Account Status</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted font-medium">Member Since</span>
            <span className="text-text-secondary font-mono">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Security Form Card */}
      <div className="lg:col-span-2 bg-bg-secondary border border-border rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <KeyRound className="text-accent" size={18} />
            Security Settings
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Update your account password. Choose a secure, random password to protect your account.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-semibold text-text-primary"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="w-full rounded-md border border-border bg-bg-primary pl-3 pr-10 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary cursor-pointer"
                title={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label
              htmlFor="newPassword"
              className="block text-sm font-semibold text-text-primary"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full rounded-md border border-border bg-bg-primary pl-3 pr-10 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary cursor-pointer"
                title={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-text-primary"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full rounded-md border border-border bg-bg-primary pl-3 pr-10 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary cursor-pointer"
                title={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="pt-2 pb-1 space-y-2">
            <p className="text-xs font-semibold text-text-muted">Password requirements:</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs">
                {hasMinLength ? (
                  <Check size={14} className="text-emerald-500 stroke-[3px]" />
                ) : (
                  <X size={14} className="text-text-muted/60" />
                )}
                <span className={hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-text-secondary"}>
                  At least 8 characters long
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {passwordsMatch ? (
                  <Check size={14} className="text-emerald-500 stroke-[3px]" />
                ) : (
                  <X size={14} className="text-text-muted/60" />
                )}
                <span className={passwordsMatch ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-text-secondary"}>
                  New passwords must match
                </span>
              </div>
            </div>
          </div>

          {/* Submit button & response status */}
          <div className="pt-3 border-t border-border flex items-center gap-4 flex-wrap">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock size={15} />
                  Update Password
                </>
              )}
            </button>

            {status && status !== "success" && (
              <p className="text-xs font-semibold text-red-500">
                {status}
              </p>
            )}

            {status === "success" && (
              <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                Password changed successfully!
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
