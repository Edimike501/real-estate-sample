"use client";

import { useMutation } from "@tanstack/react-query";

import { ContactRequest, sendContactMessage } from "@/lib/api/contact.api";

export function useSendContact() {
  return useMutation({
    mutationFn: (data: ContactRequest) => sendContactMessage(data)
  });
}
