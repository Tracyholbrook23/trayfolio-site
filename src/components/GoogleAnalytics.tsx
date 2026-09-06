import Script from "next/script";

/**
 * Loads GA4 only when an ID is configured. Set NEXT_PUBLIC_GA_MEASUREMENT_ID
 * in .env.local and in Vercel's env vars (must keep the NEXT_PUBLIC_ prefix
 * so the browser can read it) to turn this on; until then it silently
 * renders nothing, same "degrades gracefully when unset" pattern the rest
 * of this repo already uses for optional integrations.
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
