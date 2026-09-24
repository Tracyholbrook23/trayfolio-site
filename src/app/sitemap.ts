import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const BASE_URL = "https://www.trayfolio.net";

// Marketing pages only. The Stripe checkout redirect targets under /start/
// (success, canceled, demo-success) are transactional, not content, so they
// stay out of the sitemap.
const routes = [
  "",
  "/work",
  "/services",
  "/demo",
  "/about",
  "/book",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes, ...projects.map((project) => `/work/${project.slug}`)].map((route) => ({
    url: `${BASE_URL}${route}`,
  }));
}
