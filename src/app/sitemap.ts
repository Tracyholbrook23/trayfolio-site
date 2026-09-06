import type { MetadataRoute } from "next";

const BASE_URL = "https://www.trayfolio.net";

// Marketing pages only. The Stripe checkout redirect targets under /start/
// (success, canceled, demo-success) are transactional, not content, so they
// stay out of the sitemap.
const routes = ["", "/pricing", "/contact", "/faq", "/start", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
  }));
}
