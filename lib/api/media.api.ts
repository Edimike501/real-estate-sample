import { fetcher } from "./fetcher";

import { PropertyMedia } from "@/types";

export async function uploadMedia(formData: FormData): Promise<PropertyMedia> {
  const res = await fetch("/api/admin/media/upload", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    let errData: { error?: string } | undefined;
    try {
      errData = await res.json();
    } catch {}
    throw new Error(errData?.error || "Failed to upload media");
  }

  return (await res.json()) as PropertyMedia;
}

export async function deleteMedia(id: string): Promise<{ success: boolean }> {
  return fetcher<{ success: boolean }>(`/api/admin/media/${id}`, {
    method: "DELETE"
  });
}
