"use client";

import { ImagePlus, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";

import { CloudinaryImage } from "@/components/shared/cloudinary-image";

type MediaUploaderProps = {
  propertyId: string;
};

type UploadedMedia = {
  id: string;
  url: string;
  thumbnailUrl?: string;
};

type StagedMedia = {
  id: string;
  file: File;
  previewUrl: string;
  altText: string;
};

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaUploader({ propertyId }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadedMedia[]>([]);
  const [staged, setStaged] = useState<StagedMedia[]>([]);
  const [status, setStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const heroPreview = staged[0];

  function stageFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (!imageFiles.length) {
      setStatus("Choose at least one image file.");
      return;
    }

    const nextItems = imageFiles.map((file) => ({
      id: createId(),
      file,
      previewUrl: URL.createObjectURL(file),
      altText: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "),
    }));

    setStaged((current) => [...current, ...nextItems]);
    setStatus(`${nextItems.length} image${nextItems.length === 1 ? "" : "s"} ready to upload.`);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) stageFiles(event.target.files);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    stageFiles(event.dataTransfer.files);
  }

  function removeStaged(id: string) {
    setStaged((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function clearStaged() {
    staged.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setStaged([]);
    setStatus("Selection cleared.");
  }

  function updateAltText(id: string, value: string) {
    setStaged((current) => current.map((item) => (item.id === id ? { ...item, altText: value } : item)));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!staged.length || isUploading) return;

    setIsUploading(true);
    setStatus(`Uploading ${staged.length} image${staged.length === 1 ? "" : "s"}...`);

    const completed: UploadedMedia[] = [];

    for (const [index, item] of staged.entries()) {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("propertyId", propertyId);
      formData.append("altText", item.altText);
      formData.append("order", String(uploads.length + index));

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus(
          `Upload failed on ${item.file.name}: ${errorData?.error ?? "The server could not process the image."}`
        );
        setIsUploading(false);
        setStaged(staged.slice(index));
        setUploads((current) => [...completed.reverse(), ...current]);
        return;
      }

      const data = (await response.json()) as UploadedMedia;
      completed.push(data);
      URL.revokeObjectURL(item.previewUrl);
    }

    setUploads((current) => [...completed.reverse(), ...current]);
    setStaged([]);
    setIsUploading(false);
    setStatus("Media uploaded and attached to this property.");
  }

  return (
    <form onSubmit={onSubmit} className="overflow-hidden rounded-lg border border-border bg-bg-secondary">
      <div className="border-b border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Property media</h2>
            <p className="text-sm text-text-muted">Preview images locally before spending an upload.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {staged.length ? (
              <button
                type="button"
                onClick={clearStaged}
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-red-400 hover:text-red-300 disabled:opacity-60"
              >
                <X size={16} />
                Clear
              </button>
            ) : null}
            <button
              type="submit"
              disabled={!staged.length || isUploading}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              {isUploading ? "Uploading" : "Upload selected media"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`relative flex min-h-80 cursor-pointer flex-col justify-end overflow-hidden rounded-lg border border-dashed transition ${
            isDragging ? "border-accent bg-accent/10" : "border-border bg-bg-primary"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFileChange} className="sr-only" />
          {heroPreview ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroPreview.previewUrl})` }}
              aria-hidden="true"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(57,75,209,0.18),rgba(8,12,32,0.96))]" aria-hidden="true" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/35 to-transparent" aria-hidden="true" />
          <div className="relative p-5">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur">
              <ImagePlus size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white">
              {heroPreview ? heroPreview.file.name : "Drop property images here"}
            </h3>
            <p className="mt-1 max-w-xl text-sm text-white/75">
              {heroPreview
                ? `${formatFileSize(heroPreview.file.size)} selected locally. Nothing uploads until you submit.`
                : "Select or drag images to build a polished preview set before uploading."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-text-primary">Selected previews</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent hover:text-text-primary"
            >
              <ImagePlus size={16} />
              Add images
            </button>
          </div>

          {staged.length ? (
            <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
              {staged.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[88px_1fr_auto] gap-3 rounded-lg border border-border bg-bg-primary p-2">
                  <div
                    className="h-20 rounded-md bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.previewUrl})` }}
                    aria-label={item.file.name}
                  />
                  <div className="min-w-0 space-y-2">
                    <div>
                      <p className="truncate text-sm font-semibold text-text-primary">{index + 1}. {item.file.name}</p>
                      <p className="text-xs text-text-muted">{formatFileSize(item.file.size)}</p>
                    </div>
                    <input
                      value={item.altText}
                      onChange={(event) => updateAltText(item.id, event.target.value)}
                      placeholder="Alt text"
                      className="w-full rounded-md border border-border bg-bg-secondary px-2 py-1.5 text-xs text-text-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStaged(item.id)}
                    disabled={isUploading}
                    title="Remove image"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-300 disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center rounded-lg border border-border bg-bg-primary p-6 text-center">
              <p className="text-sm text-text-muted">No images selected yet.</p>
            </div>
          )}

          {status ? <p className="text-sm text-text-secondary">{status}</p> : null}
        </div>
      </div>

      {uploads.length ? (
        <div className="border-t border-border p-4">
          <p className="mb-3 text-sm font-semibold text-text-primary">Uploaded this session</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {uploads.map((item) => (
              <CloudinaryImage
                key={item.id}
                src={item.thumbnailUrl || item.url}
                alt="Uploaded media"
                width={400}
                height={300}
                className="aspect-[4/3] rounded-md border border-border"
              />
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
