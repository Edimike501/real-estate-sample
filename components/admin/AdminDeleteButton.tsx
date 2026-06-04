"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminDeleteButtonProps = {
  endpoint: string;
  label: string;
  confirmMessage: string;
  redirectTo: string;
};

export function AdminDeleteButton({ endpoint, label, confirmMessage, redirectTo }: AdminDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function onDelete() {
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await fetch(endpoint, { method: "DELETE" });
    setIsDeleting(false);

    if (response.ok) {
      router.push(redirectTo);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onDelete()}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 rounded-md border border-red-400 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Trash2 size={16} />
      {isDeleting ? "Deleting" : label}
    </button>
  );
}
