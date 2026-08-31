/* eslint-disable @next/next/no-img-element */
import { JsonLd } from "@/components/seo/JsonLd";
import { QueryProvider } from "@/components/shared/query-provider";
import { Toaster } from "@/components/ui/sonner";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteMetadata } from "@/metadata/site";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.auraluxuryproperties.com"
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
    "Aura",
    "Aura Luxury",
    "Aura Luxury Properties",
    "Aura Luxury Properties Ltd",
    "buy house Lagos",
    "Nigerian Diaspora real estate"
  ],
  authors: [{ name: siteMetadata.company.owner || siteMetadata.company.name }],
  icons: {
    // icon: "/icon.png",
    icon: [
      { url: "/favicon.ico", sizes: "any" }, // Standard fallback
      { url: "/icon-static-32x32.png", type: "image/png", sizes: "32x32" } // Explicit size for Bravebot
    ],
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
    url: "https://www.auraluxuryproperties.com", // ← ADD THIS (fixes og:url)
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
    yandex: "f68f08098931ea5c",
    other: {
      "msvalidate.01": "CBF3579FFE59B5BE3A9B4D8C3E421BDA" // Add your unique Bing verification token here
    }
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
  // Grab the generated cryptographic token from the middleware request headers
  const headerList = await headers();
  const nonce = headerList.get("x-nonce") || undefined;

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.auraluxuryproperties.com";

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
            <Toaster />
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

        {/* Yandex.Metrica Counter */}
        <Script
          type="text/javascript"
          id="yandex-metrica"
          strategy="afterInteractive"
          nonce={nonce}>
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < e.length; j++) {if (e[j].r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${process.env.NEXT_PUBLIC_YANDEX_METRICA_ID}", "ym");

                ym(${process.env.NEXT_PUBLIC_YANDEX_METRICA_ID}, "init", {
                ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true
                });
              `}
        </Script>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${process.env.NEXT_PUBLIC_YANDEX_METRICA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
