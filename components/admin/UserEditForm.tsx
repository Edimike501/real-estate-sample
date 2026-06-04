"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { AppSelect } from "@/components/ui/app-select";
import { type User } from "@/types";
import { UserRole } from "@/types/enums";

type UserEditFormProps = {
  user: User;
};

export function UserEditForm({ user }: UserEditFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? ""),
      isActive: formData.get("isActive") === "on",
    };

    const response = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("User saved.");
      router.push(`/admin/dashboard/users/${user.id}`);
      router.refresh();
      return;
    }

    setStatus("Failed to save user.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-border bg-bg-secondary p-4">
      <input name="name" defaultValue={user.name} placeholder="Name" required className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm" />
      <input name="email" type="email" defaultValue={user.email} placeholder="Email" required className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm" />
      <AppSelect
        name="role"
        defaultValue={String(user.role)}
        placeholder="User Role"
        options={Object.values(UserRole).map((value) => ({ value, label: value }))}
      />
      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input name="isActive" type="checkbox" defaultChecked={user.isActive} className="h-4 w-4" />
        Active
      </label>
      <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">
        Save User
      </button>
      {status ? <p className="text-sm text-text-secondary">{status}</p> : null}
    </form>
  );
}
