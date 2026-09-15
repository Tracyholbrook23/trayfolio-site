import type { Metadata } from "next";
import localFont from "next/font/local";
import ScrollProgress from "@/components/ScrollProgress";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { PreviewBanner } from "@/components/PreviewBanner";
import "./globals.css";

const clashDisplay = localFont({
  src: "../fonts/ClashDisplay-Bold.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-clash",
  display: "swap",
});

const SITE_URL = "https://www.trayfolio.net";
const SITE_TITLE = "Trayfolio: Websites for small businesses";
const SITE_DESCRIPTION =
  "Trayfolio builds fast, clean, professional websites for small businesses, from first draft to launch, with support after.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Trayfolio",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

// ProfessionalService rather than LocalBusiness: Trayfolio has no storefront
// clients visit, it's a one-person remote web design service, so there's no
// street address to publish. This is the schema.org-recommended shape for a
// service-area business like this one.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Trayfolio",
  url: SITE_URL,
  image: `${SITE_URL}/icon.png`,
  description: SITE_DESCRIPTION,
  email: "tracyholbrook532@gmail.com",
  sameAs: ["https://www.instagram.com/trayfolio"],
  areaServed: "US",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          href="/textures/wrinkled-paper.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <PreviewBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a href="#main-content" className="sr-only fixed left-3 top-3 z-[110] rounded-lg bg-white px-5 py-3 text-stone-900 focus:not-sr-only">Skip to content</a>
        <ScrollProgress />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
