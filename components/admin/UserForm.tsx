"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

import { AppSelect } from "@/components/ui/app-select";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { formatEnum } from "@/lib/utils";
import { type User } from "@/types";
import { UserRole } from "@/types/enums";

type UserFormProps = {
  user?: User;
};

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const isEditing = Boolean(user);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isPending = createUserMutation.isPending || updateUserMutation.isPending;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const role = String(formData.get("role") ?? "");

    if (isEditing && user) {
      const isActive = formData.get("isActive") === "on";
      updateUserMutation.mutate(
        { id: user.id, data: { name, role, isActive } },
        {
          onSuccess: () => {
            toast.success("User saved successfully.");
            router.push(`/admin/dashboard/users/${user.id}`);
          },
          onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to save user.");
          }
        }
      );
    } else {
      const password = String(formData.get("password") ?? "");
      createUserMutation.mutate(
        { name, email, password, role },
        {
          onSuccess: () => {
            toast.success("User created successfully.");
            router.push("/admin/dashboard/users");
          },
          onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to create user.");
          }
        }
      );
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
          placeholder="e.g. Aura Admin"
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
          disabled={isEditing}
          className={`w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
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
            minLength={6}
            className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
          />
          <p className="text-xs text-text-muted mt-1">
            Must be at least 6 characters long.
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
          disabled={isPending}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition cursor-pointer">
          {isPending ? "Saving..." : isEditing ? "Save User" : "Create User"}
        </button>
      </div>
    </form>
  );
}
