"use client";

import { Send } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "sonner";

import { useSendContact } from "@/hooks/useContact";

export default function ContactForm() {
  const sendContactMutation = useSendContact();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const entries = Object.fromEntries(formData);
    const payload = {
      name: String(entries.name || ""),
      email: String(entries.email || ""),
      phone: entries.phone ? String(entries.phone) : undefined,
      message: String(entries.message || "")
    };

    sendContactMutation.mutate(payload, {
      onSuccess: () => {
        form.reset();
        toast.success("Message sent. We'll be in touch shortly.");
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Something went wrong. Please try WhatsApp or email.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-secondary border border-border rounded-lg p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="block text-sm font-semibold text-text-primary">
            Name
          </span>
          <input
            name="name"
            type="text"
            required
            className="w-full rounded-md border border-border bg-bg-primary px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
          />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-text-primary">
            Phone
          </span>
          <input
            name="phone"
            type="tel"
            required
            className="w-full rounded-md border border-border bg-bg-primary px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
          />
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="block text-sm font-semibold text-text-primary">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-border bg-bg-primary px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
        />
      </label>

      <label className="space-y-2 block">
        <span className="block text-sm font-semibold text-text-primary">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full resize-none rounded-md border border-border bg-bg-primary px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
        />
      </label>

      <button
        type="submit"
        disabled={sendContactMutation.isPending}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-70">
        <Send className="h-5 w-5" />
        {sendContactMutation.isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
