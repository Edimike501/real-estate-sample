import { fetcher } from "./fetcher";

export type ContactRequest = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export type ContactResponse = {
  success: boolean;
  message: string;
};

export async function sendContactMessage(data: ContactRequest): Promise<ContactResponse> {
  return fetcher<ContactResponse>("/api/contact", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
