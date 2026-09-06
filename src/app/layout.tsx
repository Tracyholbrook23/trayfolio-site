import type { Metadata } from "next";
import localFont from "next/font/local";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import GoogleAnalytics from "@/components/GoogleAnalytics";
// Required by Lenis. Without it html keeps the `h-full` height below
// (100% = viewport), so Lenis measures the page as one screen tall and
// caps scrolling short of the real bottom. Its stylesheet sets
// `html.lenis, html.lenis body { height: auto }`, which lets Lenis see
// the true content height and re-measure when the page grows.
import "lenis/dist/lenis.css";
import "./globals.css";

const clashDisplay = localFont({
  src: [
    {
      path: "../fonts/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/ClashDisplay-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SmoothScroll>
          <ScrollProgress />
          {children}
        </SmoothScroll>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
