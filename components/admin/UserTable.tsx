"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce.hooks";
import { type User } from "@/types";

export function UserTable() {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const debouncedSearch = useDebounce(searchInput, 400);

  async function deleteUser(user: User) {
    const confirmed = window.confirm(`Delete "${user.name}"?`);
    if (!confirmed) return;

    const response = await fetch(`/api/users/${user.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setUsers((current) => current.filter((item) => item.id !== user.id));
    }
  }

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);

    fetch(`/api/users?${params.toString()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { users: User[] } | null) => {
        if (data) setUsers(data.users);
      });
  }, [debouncedSearch]);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-bg-secondary p-4">
      <input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search users"
        className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="py-2 text-text-primary">{user.name}</td>
                <td className="py-2 text-text-secondary">{user.email}</td>
                <td className="py-2 text-text-secondary">{user.role}</td>
                <td className="py-2 text-text-secondary">{user.isActive ? "Active" : "Inactive"}</td>
                <td className="py-2">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/dashboard/users/${user.id}`}
                      title="View user"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/dashboard/users/${user.id}/edit`}
                      title="Edit user"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-accent hover:text-text-primary"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      type="button"
                      title="Delete user"
                      onClick={() => void deleteUser(user)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
