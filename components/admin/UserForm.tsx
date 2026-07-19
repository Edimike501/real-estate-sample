"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { AppSelect } from "@/components/ui/app-select";
import { formatEnum } from "@/lib/utils";
import { type User } from "@/types";
import { UserRole } from "@/types/enums";

type UserFormProps = {
  user?: User;
};

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(user);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? "")
    };

    if (isEditing) {
      payload.isActive = formData.get("isActive") === "on";
    } else {
      payload.password = String(formData.get("password") ?? "");
    }

    try {
      const response = await fetch(
        isEditing ? `/api/users/${user?.id}` : "/api/users",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json().catch(() => null);

      if (response.ok) {
        const successMsg = isEditing ? "User saved successfully." : "User created successfully.";
        setStatus(successMsg);
        toast.success(successMsg);
        if (isEditing) {
          router.push(`/admin/dashboard/users/${user?.id}`);
        } else {
          router.push(`/admin/dashboard/users`);
        }
        router.refresh();
        return;
      }

      const errorMsg = data?.error ?? `Failed to ${isEditing ? "save" : "create"} user.`;
      setStatus(errorMsg);
      toast.error(errorMsg);
    } catch (e) {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setStatus(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl space-y-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-text-primary">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={user?.name}
          placeholder="e.g. Opollo Admin"
          required
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-text-primary">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email}
          placeholder="e.g. admin@opololuxuries.com"
          required
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
        />
      </div>

      {!isEditing && (
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-text-primary">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
          />
          <p className="text-xs text-text-muted mt-1">
            Must be at least 8 characters long.
          </p>
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-sm font-semibold text-text-primary">
          User Role
        </label>
        <AppSelect
          name="role"
          defaultValue={user ? String(user.role) : "ADMIN"}
          placeholder="Select User Role"
          options={
            isEditing
              ? Object.values(UserRole).map((value) => ({
                  value,
                  label: formatEnum(value)
                }))
              : ["ADMIN", "VIEWER"].map((value) => ({
                  value,
                  label: formatEnum(value)
                }))
          }
        />
      </div>

      {isEditing && (
        <div className="pt-2">
          <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer select-none">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={user?.isActive}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent bg-bg-primary"
            />
            Active Account
          </label>
          <p className="text-xs text-text-muted ml-6 mt-0.5">
            If unchecked, this user will immediately be barred from logging in.
          </p>
        </div>
      )}

      <div className="pt-3 border-t border-border flex items-center justify-between gap-4 flex-wrap">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition cursor-pointer">
          {loading ? "Saving..." : isEditing ? "Save User" : "Create User"}
        </button>

        {status ? (
          <p
            className={`text-xs font-semibold ${status.includes("successfully") ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
            {status}
          </p>
        ) : null}
      </div>
    </form>
  );
}
