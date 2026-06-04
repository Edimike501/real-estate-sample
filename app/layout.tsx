import { QueryProvider } from "@/components/shared/query-provider";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteMetadata } from "@/metadata/site";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: {
    default: siteMetadata.company.name,
    template: `%s | ${siteMetadata.company.name}`,
  },
  description: siteMetadata.company.description,
  keywords: [
    "luxury real estate",
    "real estate Nigeria",
    "property investment",
    "Lagos properties",
    "diaspora investment",
    "property sales",
    "land for sale",
    "residential properties",
    "commercial properties",
  ],
  authors: [{ name: siteMetadata.company.owner || siteMetadata.company.name }],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: siteMetadata.company.name,
    description: siteMetadata.company.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.company.name,
    description: siteMetadata.company.description,
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}>
          <QueryProvider>
            <WhatsAppButton
              variant="floating"
              phoneNumber={siteMetadata.contact.whatsapp}
              message={siteMetadata.contact.whatsappMessage}
              label="Chat on WhatsApp"
            />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
