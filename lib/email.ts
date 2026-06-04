import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

type InquiryEmailParams = {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  message?: string;
  source: string;
};

export async function sendInquiryNotification(params: InquiryEmailParams): Promise<void> {
  if (!resend || !adminEmail) {
    return;
  }

  const { guestName, guestPhone, guestEmail, propertyTitle, propertyLocation, message, source } = params;

  await resend.emails.send({
    from: "Opollo Website <notifications@opolloluxuries.com>",
    to: adminEmail,
    subject: propertyTitle ? `New Inquiry: ${propertyTitle}` : "New General Inquiry - Opollo Website",
    html: `
      <h2>New Inquiry Received</h2>
      <table cellpadding="8" style="border-collapse:collapse">
        <tr><td><strong>Name:</strong></td><td>${guestName}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${guestPhone}</td></tr>
        ${guestEmail ? `<tr><td><strong>Email:</strong></td><td>${guestEmail}</td></tr>` : ""}
        ${propertyTitle ? `<tr><td><strong>Property:</strong></td><td>${propertyTitle}</td></tr>` : ""}
        ${propertyLocation ? `<tr><td><strong>Location:</strong></td><td>${propertyLocation}</td></tr>` : ""}
        ${message ? `<tr><td><strong>Message:</strong></td><td>${message}</td></tr>` : ""}
        <tr><td><strong>Source:</strong></td><td>${source}</td></tr>
      </table>
      <p>Log into the admin dashboard to manage this inquiry.</p>
    `,
  });
}
