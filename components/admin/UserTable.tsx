"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { useDebounce } from "@/hooks/use-debounce.hooks";
import { useAdminUsers, useDeleteUser } from "@/hooks/useUsers";
import { formatEnum } from "@/lib/utils";
import { type User } from "@/types";

export function UserTable() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const { data, isLoading } = useAdminUsers({ search: debouncedSearch });
  const users = data?.users || [];

  const deleteUserMutation = useDeleteUser();

  function performDeleteUser(user: User) {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        toast.success("User deleted successfully.");
      },
      onError: (err) => {
        toast.error(
          err instanceof Error ? err.message : "Failed to delete user."
        );
      }
    });
  }

  function deleteUser(user: User) {
    toast.warning("Confirm Deletion", {
      description: `Delete "${user.name}"?`,
      action: {
        label: "Delete",
        onClick: () => performDeleteUser(user)
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search users by name or email..."
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
        />
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-border/80 bg-bg-primary">
        <table className="min-w-200 w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-text-muted bg-bg-secondary/40 border-b border-border/60">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Name
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Email
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Role
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted text-right whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-text-muted">
                  Loading users...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user: User) => (
                <tr
                  key={user.id}
                  className="hover:bg-bg-secondary/15 transition-colors">
                  <td className="px-4 py-3.5 text-text-primary font-semibold whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary font-medium whitespace-nowrap">
                    {formatEnum(user.role)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                          : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50"
                      }`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/users/${user.id}`}
                        title="View user"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary">
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/dashboard/users/${user.id}/edit`}
                        title="Edit user"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary bg-bg-primary">
                        <Edit size={15} />
                      </Link>
                      <button
                        type="button"
                        title="Delete user"
                        onClick={() => deleteUser(user)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-500 bg-bg-primary cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-text-muted">
                  No users found matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
