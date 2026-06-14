import { JsonLd } from "@/components/seo/JsonLd";
import { QueryProvider } from "@/components/shared/query-provider";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteMetadata } from "@/metadata/site";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.opolloluxuries.com"
  ),

  title: {
    default: siteMetadata.company.name,
    template: `%s | ${siteMetadata.company.name}`
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
    "Opollo", // ← ADD brand name
    "Opollo Luxury", // ← ADD brand name
    "Opollo Luxury Properties", // ← ADD brand name
    "buy house Lagos", // ← ADD high-intent keyword
    "Nigerian Diaspora real estate" // ← ADD Diaspora keyword
  ],
  authors: [{ name: siteMetadata.company.owner || siteMetadata.company.name }],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png"
    /* icon: "/og-image.png",
    shortcut: "/og-image.png",
    apple: "/og-image.png" */
  },
  openGraph: {
    title: siteMetadata.company.name,
    description: siteMetadata.company.description,
    type: "website",
    url: "https://www.opolloluxuries.com", // ← ADD THIS (fixes og:url)
    siteName: siteMetadata.company.name, // ← ADD THIS (fixes og:site_name)
    locale: "en_NG", // ← ADD THIS
    images: [
      // ← ADD THIS BLOCK (fixes og:image)
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${siteMetadata.company.name} — Premium Real Estate in Nigeria`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.company.name,
    description: siteMetadata.company.description,
    images: ["/og-image.jpg"] // ← ADD THIS (Twitter card image)
  },
  verification: {
    google: "QNfT_B0u38uhJYWrXmuR5gtsGA5MO8ekvEJmoHOqvy8",
    yandex: "f68f08098931ea5c"
  },
  alternates: {
    canonical: "./"
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Extract the unique nonce created by your middleware
  // const nonce = (await headers()).get("x-nonce") || undefined;
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.opolloluxuries.com";

  const globalOrganizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: siteMetadata.company.name,
        url: baseUrl,
        logo: `${baseUrl}${siteMetadata.company.logo}`
        // sameAs: [
        //   siteMetadata.contact.instagram,
        //   siteMetadata.contact.facebook,
        //   siteMetadata.contact.linkedin
        // ]
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: siteMetadata.company.name,
        publisher: { "@id": `${baseUrl}/#organization` }
      }
    ]
  };

  return (
    // <html lang="en" suppressHydrationWarning nonce={nonce}>
    <html lang="en" suppressHydrationWarning>
      {/*  <meta
        name="google-site-verification"
        content="QNfT_B0u38uhJYWrXmuR5gtsGA5MO8ekvEJmoHOqvy8"
      /> */}
      <head>
        <JsonLd schema={globalOrganizationSchema} />
      </head>
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

        {/* Google Analytics Engine */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
